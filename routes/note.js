const express = require('express');

const router = express.Router();

const Note = require('../models/note');
const isAuth = require('../middleware/is-auth');

router.post('/', isAuth, (req, res, next) => {
    const note = new Note({
        title: req.body.title,
        sections: req.body.sections.map(m => {
            return {
                sectionTitle: m.sectionTitle,
                content: m.content
            }
        }),
        category: req.body.category,
        creator: req.userId
    });
    note.save().then(addedNote => {
        res.status(200).json({
            note: addedNote,
            userId: req.userId
        });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not add the note.',
          success: false
        });
      });
});

router.get('/', isAuth, (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const byTitle = +req.query.bytitle;
    const byCreatedDate = +req.query.bycreateddate;
    const byUpdatedDate = +req.query.byupdateddate;
    let fetchedNotes;
    const noteQuery = Note.find({creator: req.userId}).populate('creator');
    if (pageSize && currentPage) {
        noteQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    if (byTitle) {
        noteQuery.sort({title: byTitle});
    }
    if (byCreatedDate) {
        noteQuery.sort({createdAt: byCreatedDate});
    }
    if (byUpdatedDate) {
        noteQuery.sort({updatedAt: byUpdatedDate});
    }
    noteQuery.then(notes => {
        if (!notes) {
            return res.status(404).json({message: 'No notes found.', success: false});
        }
        fetchedNotes = notes;
        return Note.find({creator: req.userId}).count();
    }).then(count => {
        res.status(200).json({
            message: 'Notes fetched successfully!',
            notes: fetchedNotes,
            totalNotes: count
          });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not get the notes.', success: false
        });
      });
});

router.get('/:noteId', isAuth, (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId).then(note => {
        if (!note) {
            return res.status(404).json({message: 'No note found.', success: false});
        }
        res.status(200).json({
            note: note
        })
    }).catch(error => {
        res.status(500).json({
          message: 'Could not get the note.',
          success: false
        });
      });
});

router.get('/category/:categoryId', isAuth, (req, res, next) => {
    const categoryId = req.params.categoryId;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const byTitle = +req.query.bytitle;
    const byCreatedDate = +req.query.bycreateddate;
    const byUpdatedDate = +req.query.byupdateddate;
    let fetchedNotes;
    const noteQuery = Note.find({category: categoryId, creator: req.userId}).populate('creator');
    if (pageSize && currentPage) {
        noteQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    if (byTitle) {
        noteQuery.sort({title: byTitle});
    }
    if (byCreatedDate) {
        noteQuery.sort({createdAt: byCreatedDate});
    }
    if (byUpdatedDate) {
        noteQuery.sort({updatedAt: byUpdatedDate});
    }
    noteQuery.then(notes => {
        if (!notes) {
            return res.status(404).json({message: 'No notes found.', success: false});
        }
        fetchedNotes = notes;
        return Note.find({category: categoryId, creator: req.userId}).count();
    }).then(count => {
        res.status(200).json({
            message: 'Notes fetched successfully!',
            notes: fetchedNotes,
            totalNotes: count
          });
    }).catch(error => {
        res.status(500).json({
          message: 'Could not get the notes.', success: false
        });
      });
});

router.put('/:noteId', isAuth, (req, res, next) => {
    const noteId = req.params.noteId;
    const note = ({
        title: req.body.title,
        sections: req.body.sections.map(m => {
            return {
                sectionTitle: m.sectionTitle,
                content: m.content
            }
        }),
        category: req.body.category
    });
    Note.updateOne({_id: noteId}, note).then(result => {
        // console.log(result);
        if (result.matchedCount > 0) {
            res.status(201).json({ message: 'Updated successfully.', success: true });
        } else {
            res.status(401).json({ message: 'Not authenticated.', success: false })
        }
    }).catch(error => {
        res.status(500).json({
          message: 'Could not update the note.',
          success: false
        });
      });
});

router.delete('/:noteId', isAuth, (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findByIdAndRemove(noteId).then(result => {
        console.log(result);
        res.status(201).json({ message: 'Deleted successfully.', success: true });
    });
});

module.exports = router;