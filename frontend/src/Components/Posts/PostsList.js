import React from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import postService from "../Services/PostService";
import commentService from "../Services/CommentService";
import Gifs from "./Gif";
import Comments from "../Comments";
import PostCreator from "./PostCreator";
import PostContent from "./PostContent";
import PostFeatures from "./PostFeatures";
import { NewCommentForm } from "../Forms/PostForms";

const PostsList = ({ post }) => {
	const queryClient = useQueryClient();
	//	const [comments, setComments] = useState([]);
	const user = JSON.parse(localStorage.getItem("user"));
	const [postModal, setPostModal] = useState({});
	const [newComment, setNewComment] = useState({});
	const [gifs, setGifs] = useState([]);
	const [selectedGif, setSelectedGif] = useState({});
	const [selectedFileC, setSelectedFileC] = useState({});
	const [showSelectedGif, setShowSelectedGif] = useState({});
	const [showGifs, setShowGifs] = useState({});
	const [showCommNum, setShowCommNum] = useState({});
	const [showCommentForm, setShowCommentForm] = useState({});
	const [showPostModal, setShowPostModal] = useState({});

	const handleDisplayCommNum = (e, postId) => {
		e.preventDefault();
		if (showCommNum.hasOwnProperty(postId)) {
			setShowCommNum({
				...showCommNum,
				[postId]: !showCommNum[postId],
			});
		} else {
			setShowCommNum((prevState) => {
				return {
					...prevState,
					[postId]: true,
				};
			});
		}
	};

	const handleDisplayPostModal = (e, postId) => {
		e.preventDefault();
		if (showPostModal.hasOwnProperty(postId)) {
			setShowPostModal({
				...showPostModal,
				[postId]: !showPostModal[postId],
			});
		} else {
			setShowPostModal((prevState) => {
				return {
					...prevState,
					[postId]: true,
				};
			});
		}
	};

	const handleDisplayCommentForm = (e, postId) => {
		e.preventDefault();
		if (showCommentForm.hasOwnProperty(postId)) {
			setShowCommentForm({
				...showCommentForm,
				[postId]: !showCommentForm[postId],
			});
		} else {
			setShowCommentForm((prevState) => {
				return {
					...prevState,
					[postId]: true,
				};
			});
		}
	};

	const handleClickDisplayGifs = (postId) => {
		if (showGifs.hasOwnProperty(postId)) {
			setShowGifs({
				...showGifs,
				[postId]: !showGifs[postId],
			});
		} else {
			setShowGifs((prevState) => {
				return {
					...prevState,
					[postId]: true,
				};
			});
		}
	};

	useEffect(() => {
		if (showCommNum) {
			console.log(showCommNum);
		}
	}, [showCommNum]);

	useEffect(() => {
		if (showCommentForm) {
			console.log(showCommentForm);
		}
	}, [showCommentForm]);

	useEffect(() => {
		if (showGifs) {
			console.log(showGifs);
		}
	}, [showGifs]);

	useEffect(() => {
		if (showPostModal) {
			console.log(showPostModal);
		}
	}, [showPostModal]);

	/* 	useEffect(() => {
		if (selectedGif) {
			console.log(selectedGif);
		}
	}, [selectedGif]); */

	const enableItemToShow = (postId, itemToShow) => {
		if (itemToShow.hasOwnProperty(postId)) {
			return itemToShow[postId];
		} else {
			return false;
		}
	};
	const handleChangeInput = (event) => {
		const { name, value } = event.target;

		setNewComment((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	};

	const handleChangeFile = (event) => {
		const { name, files } = event.target;

		setSelectedFileC((prevState) => {
			return {
				...prevState,
				[name]: files[0],
			};
		});
	};

	const deletePost = (e, postId) => {
		e.preventDefault();

		postService.fetchDeletePost(user.token, postId);
	};

	const deleteComment = (e, postId, commId) => {
		e.preventDefault();

		commentService.fetchDeleteComment(user.token, postId, commId);
	};

	const getPostId = () => {
		if (Object.keys(newComment) !== undefined) {
			return Object.keys(newComment);
		} else if (Object.keys(selectedGif) !== undefined) {
			return Object.keys(selectedGif);
		} else if (Object.keys(selectedFileC) !== undefined) {
			return Object.keys(selectedFileC);
		}
	};

	const addComment = useMutation(
		(commentData) =>
			commentService.fetchCreateComment(user.token, getPostId, commentData),
		{
			// After success or failure, refetch the todos query
			onSuccess: () => {
				queryClient.invalidateQueries("comments");
			},
		}
	);

	const submitNewComment = (e, index, postId) => {
		e.preventDefault();

		const commentSent = {};
		commentSent.content = newComment.hasOwnProperty(index)
			? newComment[index]
			: null;
		commentSent.gifUrl = selectedGif.hasOwnProperty(index)
			? selectedGif[index]
			: null;
		commentSent.postId = postId;
		commentSent.userId = user.id;

		const commentData = new FormData();
		commentData.append("newcomment", JSON.stringify(commentSent));
		selectedFileC.hasOwnProperty(index) &&
			commentData.append("image", selectedFileC[index]);

		addComment.mutate(commentData);

		//commentService.fetchCreateComment(user.token, postId, commentData);

		setNewComment({ [index]: "" });
		setSelectedGif({ [index]: "" });
		setShowCommentForm({ [index]: "" });
		setShowSelectedGif({ [index]: "" });
		setSelectedFileC({ [index]: "" });
		e.target.reset();
	};

	/* useEffect(() => {
		console.log(comments);
	}, [comments]); */
	//get gifs
	useEffect(() => {
		const getGifs = async () => {
			const resultGifs = await commentService.fetchGifs(
				process.env.REACT_APP_GIF_PASSWORD
			);
			console.log(resultGifs);
			setGifs(resultGifs.data);
		};

		getGifs().catch(console.error);
	}, []);

	const handleSelectGif = (e, postId) => {
		e.preventDefault();
		console.log(e.target);
		//const { name, src } = e.target;
		setSelectedGif((prevState) => {
			return {
				...prevState,
				[postId]: e.target.src,
			};
		});

		setShowGifs((prevState) => {
			return {
				...prevState,
				[postId]: false,
			};
		});

		setShowSelectedGif((prevState) => {
			return {
				...prevState,
				[postId]: true,
			};
		});
	};

	// Button send enable
	const enableCommentButton = (id) => {
		return newComment[id] || selectedGif[id] || selectedFileC[id]
			? false
			: true;
	};

	const getValueInputPost = (e, title, content, imageUrl) => {
		setPostModal((prevState) => {
			return {
				...prevState,
				updatedTitle: title,
			};
		});
		setPostModal((prevState) => {
			return {
				...prevState,
				updatedMessage: content,
			};
		});
		/* setPostModal((prevState) => {
			return {
				...prevState,
				updatedFile: imageUrl,
			};
		}); */
	};

	// Button send enable
	const changeCommentButtonStyle = (id) => {
		return newComment[id] || selectedGif[id] || selectedFileC[id]
			? "comments-button-enabled"
			: "comments-button-disabled";
	};

	/* //get all comments
	useEffect(() => {
		console.log(user.id);
		const getAllComments = async () => {
			const allComments = await commentService.fetchAllComments(user.token);
			setComments(allComments);
		};

		getAllComments().catch(console.error);
	}, []); */

	const { isLoading, error, data } = useQuery("comments", () =>
		commentService.fetchAllComments(user.token)
	);

	const comments = data || [];

	const [showSuppPostModal, setShowSuppPostModal] = useState({});

	useEffect(() => {
		if (showSuppPostModal) {
			console.log(showSuppPostModal);
		}
	}, [showSuppPostModal]);

	return (
		<div key={post.id} className="card my-4 card-responsive">
			<div className="container">
				<div className="row">
					<h3 className="h3-change py-1 overflow">
						{" "}
						<strong className="text-secondary">Message :</strong> {post.title}
					</h3>
					<PostCreator post={post} />
					<div className=" card col-sm-10 padding-col">
						<PostContent
							post={post}
							deletePost={deletePost}
							handleDisplayPostModal={handleDisplayPostModal}
							getValueInputPost={getValueInputPost}
						/>
						<PostFeatures
							post={post}
							showCommNum={showCommNum}
							handleDisplayCommNum={handleDisplayCommNum}
							handleDisplayCommentForm={handleDisplayCommentForm}
						/>

						<div>
							{enableItemToShow(post.id, showCommNum) === true &&
								comments.length > 0 &&
								comments
									.filter((col) => col.postId === post.id)
									.map((comment, index) => (
										<div className="" key={index}>
											<Comments
												comment={comment}
												post={post}
												deleteComment={deleteComment}
											/>
										</div>
									))}
							{enableItemToShow(post.id, showSelectedGif) === true && (
								<img
									alt="gif-selected"
									className="img-animated-gif flex-nowrap"
									src={selectedGif[post.id]}
								/>
							)}
							{selectedFileC[post.id] ? (
								<em className="mx-3 text-success">
									{selectedFileC[post.id].name}
								</em>
							) : null}
							{showCommentForm[post.id] && (
								<div className="card-footer">
									<NewCommentForm
										postId={post.id}
										index={post.id}
										enableCommentButton={enableCommentButton}
										changeCommentButtonStyle={changeCommentButtonStyle}
										handleChangeInput={handleChangeInput}
										handleChangeFile={handleChangeFile}
										handleClickDisplayGifs={handleClickDisplayGifs}
										submitNewComment={submitNewComment}
									/>
								</div>
							)}
							{enableItemToShow(post.id, showGifs) === true && (
								<div className="d-flex flex-wrap flex-row justify-content-between align-items-center">
									{gifs.map((gif, idx) => (
										<div key={idx}>
											<Gifs
												postId={post.id}
												gif={gif}
												index={idx}
												handleSelectGif={handleSelectGif}
											/>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostsList;