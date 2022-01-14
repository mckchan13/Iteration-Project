import React, { useState } from "react";
import Cookies from "js-cookie";
import ChipInput from "material-ui-chip-input";
import axios from "axios";

const PostWorkoutContainer = ({ getWorkOutsList }) => {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [athleteId, setAthleteId] = useState(Cookies.get("athleteId"));

  const onBodyChange = (e) => setBody(e.target.value);
  const onTitleChange = (e) => setTitle(e.target.value);

  const handlePost = async (e) => {
    e.preventDefault();
    // console.log("You have clicked the submit button.");
    let postId;
    //writing to the database
    const headers = {
      headers: { "Content-Type": "application/json" },
    };

    const result = await axios.post(
      "/post-workout",
      { athlete_id: athleteId, workout_title: title, workout_content: body },
      headers
    );
    console.log(result);
    postId = result.data.post;

    //TO DO:
    //loop through tags and make post req to api to create tags
    if (tags.length) {
      tags.map(async (elem) => {
        const tag_result = await axios.post(
          "/post-tag",
          { tag: elem, athlete_id: athleteId, workout_id: postId },
          headers
        );
        console.log(tag_result);
      });
    }
    //reset the content of text field after post
    setBody("");
    setTitle("");
    setTags([]);
  };

  const handleAddChip = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDeleteChip = (chipToDelete) => {
    setTags(tags.filter((tag) => tag !== chipToDelete));
  };

  const clearPost = () => {
    setBody("");
    setTitle("");
    setTags([]);
  };

  return (
    <div className="bg-neutral bg-center flex flex-col flex-start mx-auto items-center shadow-lg mt-55 mx-8 my-5 max-w-lg h-max mb-6 pb-6">
      <div className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
        <h3 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Post Workout</h3>
        <textarea
          className="bg-gray-100 rounded border border-gray-400 leading-normal resize w-full h-11 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
          type="textarea"
          id="textbox"
          name="title"
          placeholder="Workout Title"
          value={title}
          onChange={onTitleChange}
        />
        <textarea
          className="bg-gray-100 rounded border border-gray-400 leading-normal resize w-full h-40 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
          type="textarea"
          id="textbox"
          name="description"
          placeholder="Workout description"
          value={body}
          onChange={onBodyChange}
          rows={10}
          cols={50}
        />
        <ChipInput
          className="bg-gray-100 rounded border border-gray-400 leading-normal resize w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={tags}
          onAdd={(chip) => handleAddChip(chip)}
          onDelete={(chip) => handleDeleteChip(chip)}
        />
        <br></br>
        <div id="button-styling" className="grid grid-cols-2 content-center">
          <button
            type="submit"
            onClick={handlePost}
            className="bg-primary text-white font-medium py-2 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
          >
            Post
          </button>

          <button
            type="submit"
            onClick={clearPost}
            className="bg-primary text-white font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
    // <Paper className={classes.paper} elevation={6}>
    //   <form
    //     className={classes.form}
    //     autoComplete="off"
    //     noValidate
    //     onSubmit={handlePost}
    //   >
    //     <Typography variant="h6">Post Workout</Typography>
    //     <TextField
    //       className={classes.field}
    //       name="title"
    //       variant="outlined"
    //       label="Title"
    //       fullWidth
    //       required
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //     />
    //     <TextField
    //       className={classes.field}
    //       name="description"
    //       variant="outlined"
    //       label="Description"
    //       fullWidth
    //       multiline
    //       required
    //       rows={10}
    //       value={body}
    //       onChange={(e) => setBody(e.target.value)}
    //     />

    //     <ChipInput
    //       className={classes.field}
    //       name="tags"
    //       variant="outlined"
    //       label="Tags"
    //       fullWidth
    //       value={tags}
    //       onAdd={(chip) => handleAddChip(chip)}
    //       onDelete={(chip) => handleDeleteChip(chip)}
    //     />

    //     <Button
    //       variant="contained"
    //       color="primary"
    //       size="large"
    //       type="submit"
    //       fullWidth
    //     >
    //       Submit
    //     </Button>
    //     {/* <Button
    //       variant="contained"
    //       color="secondary"
    //       size="small"
    //       onClick={clearPost}
    //       fullWidth
    //     >
    //       Clear
    //     </Button> */}
    //   </form>
    // </Paper>
  );
};

export default PostWorkoutContainer;
