import { useState, useEffect } from "react";
import { getComments } from "../../api/communityApi";

const CommentList = ({postId}) => {
 const [comments, setComments] = useState([]);

 useEffect(() => {
   getComments(postId).then(data => {
     console.log("댓글",data);
     setComments(data)
   });
   }, [postId]);


  return (
    <div>
      <h3>댓글</h3>
      {comments.map(c => (
        <div key={c.commentId}>
          <p>{c.name} {(c.updatedAt === null ? 
            c.createdAt : (c.updatedAt + "(수정됨)"))}</p>
          <p>{c.content}</p>
        </div>
      ))}
    </div>
  );
}; 

export default CommentList; 