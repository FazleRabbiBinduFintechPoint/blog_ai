const { connectToDatabase, collectionName } = require('../../lib/mongodb');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    const id = (req.query.id || "").trim();
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    
    const db = await connectToDatabase();
    const blogId = new ObjectId(id);
    
    // Handle GET request
    if (req.method === 'GET') {
      const blog = await db.collection(collectionName).findOne({ _id: blogId });
      
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      return res.status(200).json(blog);
    }
    
    // Handle PUT request
    if (req.method === 'PUT') {
      const { title, content, author, tags } = req.body;
      
      const updatedBlog = {
        ...(title && { title }),
        ...(content && { content }),
        ...(author && { author }),
        ...(tags && { tags }),
        updatedAt: new Date(),
      };
      
      const result = await db.collection(collectionName).updateOne(
        { _id: blogId },
        { $set: updatedBlog }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      return res.status(200).json({ message: "Blog updated", result });
    }
    
    // Handle DELETE request
    if (req.method === 'DELETE') {
      const result = await db.collection(collectionName).deleteOne({ _id: blogId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Blog not found" });
      }
      
      return res.status(200).json({ message: "Blog deleted successfully" });
    }
    
    // Handle other methods
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};