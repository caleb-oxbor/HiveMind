const router = require("express").Router();
const authorization = require("../middleware/authorization");
const path = require("path");
const supabase = require("../supabaseClient");


//Get to fetch username of user
router.get('/', authorization, async (req, res) => {
  try {
    res.json({ username: req.user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Get to fetch all courses from the database
router.get("/courses", authorization, async (req, res) => {
  try {
      const { data, error } = await supabase
          .from("courses")
          .select("course_name, course_code, course_id");

      if (error) {
          console.error("Error fetching courses:", error);
          return res.status(500).json({ error: "Failed to fetch course options" });
      }

      //Formatting data into a map for dropdown purposes 
      const formattedOptions = data.map((course) => ({
          value: `${course.course_id}`,
          label: `${course.course_code}: ${course.course_name}`
      }));

      res.status(200).json(formattedOptions);
  } catch (err) {
      console.error("Unexpected error fetching course options:", err.message);
      res.status(500).json({ error: "Failed to fetch course options" });
  }
});

//Get to check if a user has posted to a class already
router.get("/check-is-posted", authorization, async (req, res) => {
  const { userID, classID } = req.query;

  try {
      if (!userID || !classID) {
          return res.status(400).json({ error: "User ID and Class ID are required" });
      }

      const { data, error } = await supabase
          .from("posts") 
          .select("user_id, course_id") 
          .eq("user_id", userID)
          .eq("course_id", classID); // these .eq are used to see if the userID has posted in the classID

      if (error) {
          console.error("Error checking if user has posted:", error);
          return res.status(500).json({ error: "Failed to check post status" });
      }

      //Check if a post exists if data.length is > 0
      const isPosted = data.length > 0 ? 1 : 0;
      res.status(200).json({ isPosted });

  } catch (err) {
      console.error("Unexpected error checking post status:", err.message);
      res.status(500).json({ error: "Failed to check post status" });
  }
});

//Get to fetch all classes a user has already posted to 
router.get("/user-classes", authorization, async (req, res) => {
  const { userID } = req.query;

  try {
      const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("course_id")
          .eq("user_id", userID);

      if (postsError) {
          console.error("Error fetching user's posts:", postsError);
          return res.status(500).json({ error: "Failed to fetch user's posts" });
      }

      //Extract all unique classIDs from the posts
      const uniqueClassIds = [...new Set(posts.map((post) => post.course_id))];

      //Query once more to courses table for course details
      const { data: courses, error: coursesError } = await supabase
          .from("courses")
          .select("course_id, course_name")
          .in("course_id", uniqueClassIds);

      if (coursesError) {
          console.error("Error fetching course details:", coursesError);
          return res.status(500).json({ error: "Failed to fetch course details" });
      }

    //Map of courseID and courseNames that the user is apart of 
      const classesWithNames = uniqueClassIds.map((classId) => {
          const course = courses.find((course) => course.course_id === classId);
          return {
              courseId: classId,
              courseName: course ? course.course_name : "Unknown Course",
          };
      });

      res.status(200).json(classesWithNames);
  } catch (err) {
      console.error("Unexpected error fetching user classes:", err.message);
      res.status(500).json({ error: "Failed to fetch user classes" });
  }
});

module.exports = router;