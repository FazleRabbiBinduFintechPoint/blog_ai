const { connectToDatabase, collectionName } = require('../../lib/mongodb');

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();

    // Handle GET request
    if (req.method === 'GET') {
      const blogs = await db.collection(collectionName).find({}).toArray();
      return res.status(200).json(blogs);
    }

    // Handle POST request
    if (req.method === 'POST') {
      const { title, content, author, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const newBlog = {
        title,
        content,
        author: author || "Anonymous",
        tags: tags || [],
        blog_code: req.body.blog_code || "",
        meta_title: req.body.meta_title || "",
        meta_description: req.body.meta_description || "",
        meta_keywords: req.body.meta_keywords || "",
        status: req.body.status || "draft",
        createdAt: new Date(),
      };

      const result = await db.collection(collectionName).insertOne(newBlog);
      return res.status(201).json({
        message: "Blog created",
        blog: newBlog,
        id: result.insertedId
      });
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};