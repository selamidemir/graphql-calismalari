import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card"
import { useSubscription } from "urql";

const newMessages = `
subscription {
  bookAdded {
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

const handleSubscription = (messages = [], response) => {
  messages[0] = true;
  messages.push(response.bookAdded)
  return [...messages];
};

export default function BookAdded() {
  const [show, setShow] = useState(true);
  const [res] = useSubscription({ query: newMessages }, handleSubscription);

  if (!res.data) return <></>;
  
  const { title, page, publish, author} = res.data[1];

  const handleShow = (e) => {
    e.preventDefault();
    setShow(false);
    delete res.data;
    setTimeout(() => setShow(true), 100)
  }

  return (
    <>
    { show && <Card className="mt-3 bg-info">
        <Card.Title>New Book Added</Card.Title>
        <Card.Body>
          <Card.Text>{title}</Card.Text>
          <Card.Text>Pages: {page}</Card.Text>
          <Card.Text>{ publish ? "Published" : "Unpublished"}</Card.Text>
          </Card.Body>
        <Card.Footer>
          {author.name}{ " " }
          {author.surname}
          <button className="btn btn-primary btn-sm ms-4" type="button" onClick={handleShow}>Hide</button>
        </Card.Footer>
      </Card>
    }
    </>
  );
}
