import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [ingred, setIngred] = useState([]);
  const [list, setList] = useState(commonIngredients);
  const [recipe, setRecipe] = useState([]);
  const [id,setId] = useState(-1)
  const [snackSave,setSnackSave] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('recipe') === null) return;
    setRecipe(JSON.parse(localStorage.getItem('recipe')));
  }, []);
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setName('')
    setIngred([])
    setOpen(true);
  };
  const handleDel = (e) => {
    const copy = recipe.filter((_v, i) => i.toString() !== e.target.id);
    setRecipe(copy);
    localStorage.setItem('recipe', JSON.stringify(copy));
  };
  const handleSave = ()=>{
    if (name === '' || ingred.length === 0) return;
    const newRecipe = {
      name: name,
      ingredients: ingred,
    };
    const copy = recipe.slice()
    copy[id] = newRecipe
    setRecipe(copy)
    localStorage.setItem('recipe', JSON.stringify(copy));
    setEditOpen(false)
    setSnackSave(true)
  }
  const handleSub = () => {
    if (name === '' || ingred.length === 0) return;
    const newRecipe = {
      name: name,
      ingredients: ingred,
    };
    const copy = recipe.slice();
    copy.push(newRecipe);
    localStorage.setItem('recipe', JSON.stringify(copy));
    setName('');
    setIngred([]);
    setRecipe(copy);
    setSnackOpen(true);
    setOpen(false);
  };
  const changeHandler = (_e, v, r) => {
    if (r === 'createOption') {
      let copy = list.slice();
      copy.push(v[v.length - 1]);
      setList(copy);
    }
    setIngred(v);
  };

  return (
    <div className="App">
      <div style={{ marginTop: 2, marginBottom: 5 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleOpen}
        >
          Add
        </Button>
      </div>
      {recipe.length===0?(<Typography margin={20} color={'#9e9e9e'}>Looks like nothing is here! Try to add something!</Typography>):''}
      <Stack sx={{ width: '60vw', margin: 'auto' }}>
        {recipe.map((v, i) => (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{v.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                color="#9e9e9e"
                variant="subtitle1"
                sx={{ textAlign: 'left' }}
              >
                Ingredients:
              </Typography>
              {v.ingredients.map((val, index) => (
                <>
                  <Typography
                    variant="body1"
                    key={index}
                    display="block"
                    sx={{ height: 50 }}
                  >
                    {val}
                  </Typography>
                  <Divider />
                </>
              ))}
              <Button
                key={i}
                startIcon={<ModeEditIcon />}
                onClick={(e) => {
                  const intId = parseInt(e.target.id);  
                  setEditOpen(true);
                  setName(recipe[intId].name);
                  setIngred(recipe[intId].ingredients);
                  setId(intId)
                }}
                id={i}
              >
                Edit
              </Button>
              <Button startIcon={<DeleteIcon />} onClick={handleDel} id={i}>
                Delete
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
        }}
        fullWidth
      >
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>Editing {name}</DialogContentText>
          <Stack spacing={2} component="form">
            <TextField
              error={name === ''}
              helperText={name === '' ? 'required' : ''}
              required
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              label="Name"
              type="text"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Autocomplete
              required
              limitTags={2}
              onChange={changeHandler}
              multiple
              freeSolo
              value={ingred}
              options={list}
              renderInput={(params) => (
                <TextField
                  error={ingred.length === 0}
                  helperText={
                    ingred.length === 0 ? 'at least one ingredients' : ''
                  }
                  variant="standard"
                  {...params}
                  fullWidth
                  label="Ingredients"
                  placeholder={ingred.length <= 3 ? 'Ingredients:' : ''}
                ></TextField>
              )}
              renderTags={renderingTags()}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button endIcon={<SaveAltIcon />} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add</DialogTitle>
        <DialogContent>
          <DialogContentText>Add your recipe here!</DialogContentText>
          <Stack spacing={2} component="form">
            <TextField
              error={name === ''}
              helperText={name === '' ? 'required' : ''}
              required
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              label="Name"
              type="text"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Autocomplete
              required
              limitTags={2}
              onChange={changeHandler}
              multiple
              freeSolo
              options={list}
              renderInput={(params) => (
                <TextField
                  error={ingred.length === 0}
                  helperText={
                    ingred.length === 0 ? 'at least one ingredients' : ''
                  }
                  variant="standard"
                  {...params}
                  fullWidth
                  label="Ingredients"
                  placeholder="Ingredients:"
                ></TextField>
              )}
              renderTags={renderingTags()}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button endIcon={<PublishIcon />} onClick={handleSub}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Added!
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackSave}
        autoHideDuration={3000}
        onClose={() => setSnackSave(false)}
      >
        <Alert
          onClose={() => setSnackSave(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Saved!
        </Alert>
      </Snackbar>
    </div>
  );

  function renderingTags() {
    return (value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
      ));
  }
}
const commonIngredients = [
  'canola oil',
  'extra-virgin olive oil',
  'toasted sesame',
  'balsamic',
  'distilled white',
  'red wine',
  'rice',
  'ketchup',
  'mayonnaise',
  'dijon mustard',
  'soy sauce',
  'chili paste',
  'hot sauce',
  'worcestershire',
  'kosher salt',
  'black peppercorns',
  'cloves',
  'ginger',
  'curry powder',
  'vanilla extract',
  'canned beans',
  'peanut butter',
  'tomatoes',
  'tuna fish',
  'baking powder',
].sort();
export default App;
