import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useQuery, useMutation } from "urql";


const GET_AUTHORS = `
query {
  authors {
    id
    name
    surname
  }
}
`;

const ADD_BOOK = `
  mutation AddNewBook($title: String!, $page: Int, $author: ID!, $publish: Boolean) {
    addBook(input: {title: $title, page: $page, author: $author, publish: $publish }) {
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

export default function Add() {
  const [updateTodoResult, updateTodo] = useMutation(ADD_BOOK);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);
  const [author, setAuthor] = useState(0);
  const [publish, setPuplish] = useState(false);

  const [result] = useQuery({
    query: GET_AUTHORS,
  });
  const { data } = result;
  const authors = typeof data !== "undefined" ? data.authors : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const variables = { title, page, publish, author};
    updateTodo(variables).then(result => console.log(result))
    setTitle("");
    setPage(0);
    setAuthor(0);
    setPuplish(false);    
  };

  const handleAuthor = (e) => {
    e.preventDefault();
    setAuthor(e.target.value);
  };

  const handleTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handlePage = (e) => {
    e.preventDefault();
    setPage(parseInt(e.target.value));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setPuplish(!publish);
  };

  return (
    <>
      <h2>Add Book</h2>
      <hr />
      <Form style={{ width: "400px", margin: "auto" }}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={handleTitle}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPage">
          <Form.Label>Page</Form.Label>
          <Form.Control
            type="number"
            placeholder="Book page count"
            value={page}
            onChange={handlePage}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Select
            aria-label="Author"
            value={author}
            onChange={handleAuthor}
          >
            <option>Select Author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} {author.surname}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 mt-2" controlId="formPublish">
          <Form.Check
            type="checkbox"
            label="Book published?"
            value={publish}
            onChange={handlePublish}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </>
  );
}
