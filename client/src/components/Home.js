import React from "react";
import { useQuery } from 'urql';

import Loading from "./Loading";
import Error from "./Error";
import Container from "react-bootstrap/esm/Container";
import Item from "./Item";
import BookAdded from "./BookAdded";

const GET_BOOKS = `
  query {
    books {
      id
      title
      page
      author {
        name
        surname
      }
    }
  }
`;

export default function Home() {
  const [result] = useQuery({
    query: GET_BOOKS,
  });

  const { data, fetching, error } = result;
  
  if (fetching) <Loading />;
  if (error) <Error msg={error.message} />;
  if( typeof data === "undefined") return <></>;
  
  const books = data.books;

  return (
    <Container>
      <BookAdded />
      {books.map((item, key)=> <Item key={key} item={item} />)}</Container>
  );
}
