import React from "react";
import "../../styles/bootstrap.min.css";
import "../../styles/footers.css";
import icon from "../../assets/icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFacebook,
	faTwitter,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
	return (
		<footer className="footer footer-change d-flex flex-wrap justify-content-evenly align-items-center py-3 mt-4 px-4 border-top bg-color">
			<div className="col-md-4 d-flex align-items-center">
				<a
					href="/"
					className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
				>
					<img src={icon} alt="Groupomania" className="gpnia-logo" />
				</a>
				<span className="text-white">2021 Groupomania</span>
			</div>

			<ul className="nav col-md-4 justify-content-end list-unstyled d-flex text-white">
				<li className="mx-3 icons-social">
					<a href="/" className="text-white text-decoration-none">
						<FontAwesomeIcon icon={faFacebook} />
					</a>
				</li>
				<li className="mx-3 icons-social">
					<a href="/" className="text-white text-decoration-none">
						{" "}
						<FontAwesomeIcon icon={faInstagram} />
					</a>
				</li>
				<li className="mx-3 icons-social">
					<a href="/" className="text-white text-decoration-none">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
				</li>
			</ul>
		</footer>
	);
}

export default Footer;
