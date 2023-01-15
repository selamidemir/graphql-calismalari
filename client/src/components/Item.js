import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function Item({item}) {
  const { id, title, page } = item;
  return (
    <Card className="mt-4">
      <Card.Title><Link to={`/book/${id}`}>{title.slice(0, 19)}</Link></Card.Title>
      <Card.Body>
        <Card.Text>{title}</Card.Text>
        <Card.Text>Page: {page}</Card.Text>
      </Card.Body>
      <Card.Footer>
        Author: {item.author && item.author.name} {item.author && item.author.surname}
      </Card.Footer>
    </Card>
  );
}
