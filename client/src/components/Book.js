import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";
import Card from "react-bootstrap/Card";

import Loading from "./Loading";
import Error from "./Error";

export default function Book() {
  const { id } = useParams();

  const GET_BOOK = `
  query getBook {
    book(id: "${id}") {
      id
      title
      page
      publish
      author {
        name
        surname
      }
    }
  }
  `;

  const [result] = useQuery({
    query: GET_BOOK,
  });
  const { data, fetching, error } = result;
  
  if (fetching) <Loading />;
  if (error) <Error msg={error.message} />;
  if (typeof data === "undefined") return <></>;
  const { title, page, publish, author } = data.book;
 

  return (
    <Card className="mt-3">
      <Card.Title>{title.slice(0, 15)}</Card.Title>
      <Card.Body>
        <Card.Text>{title}</Card.Text>
        <Card.Text>Pages: {page}</Card.Text>
        <Card.Text>{ publish ? "Published" : "Unpublished"}</Card.Text>
        </Card.Body>
      <Card.Footer>
        {author.name}
        {author.surname}
      </Card.Footer>
    </Card>
  );
}
