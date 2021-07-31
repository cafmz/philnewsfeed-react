import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Article({id,name,title,published,link}){
    return (
        <Link to={{
            pathname:`/article/${id}`,
            state: {
                name:name,
                title:title,
                published:published,
                link:link,
            }
        }}>
            <div className="article">
                <div className="article__data">
                    <h4 className="article__title">{title}</h4>
                    <h5 className="article__info">{name} | {published}</h5>
                    <hr></hr>
                </div>
            </div>
        </Link>
    );
}

Article.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
};

export default Article;