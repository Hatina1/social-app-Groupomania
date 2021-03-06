import React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import "../styles/bootstrap.min.css";
import "../styles/headers.css";
import commentService from "./Services/CommentService";
import SuppCommentModal from "./Modals/SuppCommentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function Comments({ comment, post }) {
	const queryClient = useQueryClient();
	const user = JSON.parse(localStorage.getItem("user"));
	//get comment creation date
	const sqlToJsDate = (sqlDate) => {
		var sqlDateFormat = new Date(sqlDate);
		var hour =
			sqlDateFormat.getHours().length < 10
				? "0" + sqlDateFormat.getHours()
				: sqlDateFormat.getHours();
		var minute =
			sqlDateFormat.getMinutes() < 10
				? "0" + sqlDateFormat.getMinutes()
				: sqlDateFormat.getMinutes();
		var date = new Intl.DateTimeFormat().format(sqlDateFormat);
		return date + " à " + hour + ":" + minute;
	};
	//show delete comment modal
	const [showSuppCommentModal, setShowSuppCommentModal] = useState({});
	const handleSuppCommentModal = (e, commentId) => {
		e.preventDefault();
		if (showSuppCommentModal.hasOwnProperty(commentId)) {
			setShowSuppCommentModal({
				...showSuppCommentModal,
				[commentId]: !showSuppCommentModal[commentId],
			});
		} else {
			setShowSuppCommentModal((prevState) => {
				return {
					...prevState,
					[commentId]: true,
				};
			});
		}
	};
	const enableItemToShow = (commentId, itemToShow) => {
		if (itemToShow.hasOwnProperty(commentId)) {
			return itemToShow[commentId];
		} else {
			return false;
		}
	};

	//delete comment
	const getCommId = () => {
		if (Object.keys(showSuppCommentModal) !== undefined) {
			let arrKey = Object.keys(showSuppCommentModal);
			console.log(showSuppCommentModal, arrKey[0]);
			return arrKey[0];
		}
	};
	const deleteCommentMutation = useMutation(
		(postId) => commentService.deleteComment(user.token, postId, getCommId()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("comments");
			},
		}
	);
	const deleteComment = (e, postId) => {
		e.preventDefault();
		deleteCommentMutation.mutate(postId);
	};

	return (
		<section
			key={comment.id}
			className="card-body-comment d-flex flex-column ms-4 mb-3"
		>
			<article key={comment.id} className="card-article-comment">
				<div className="card-body-header d-flex justify-content-between">
					<p className="fw-bold">
						{comment.firstname} {comment.lastname} répond :
					</p>
					<p className="fw-bold">{sqlToJsDate(comment.createdAt)}</p>
				</div>
				{comment.gifUrl && (
					<img
						className="img-animated-gif d-block align-self-center"
						src={comment.gifUrl}
						alt="gif"
					/>
				)}
				{comment.imageUrl && (
					<a
						href={comment.imageUrl}
						className="text-decoration-none align-self-center"
					>
						<img className="img-animated" src={comment.imageUrl} alt="random" />
					</a>
				)}

				<p className="p-change">{comment.content}</p>
				<div className="d-flex flex-nowrap justify-content-end">
					{user.isAdmin === true && (
						<a
							className="text-secondary text-decoration-none icons-change"
							href="/"
							target="_blank"
							onClick={(e) => handleSuppCommentModal(e, comment.id)}
						>
							<FontAwesomeIcon
								icon={faTrashCan}
								className="py-2 icon-height "
							/>
						</a>
					)}
					{enableItemToShow(comment.id, showSuppCommentModal) === true && (
						<SuppCommentModal
							post={post}
							comment={comment}
							showSuppCommentModal={showSuppCommentModal}
							handleSuppCommentModal={handleSuppCommentModal}
							deleteComment={deleteComment}
						/>
					)}
				</div>
			</article>
		</section>
	);
}

export default Comments;
