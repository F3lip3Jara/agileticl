import { createReducer, on } from '@ngrx/store';

import { BooksApiActions } from '../action_parametros/todo.actions';
import { Book } from '../models_parametros/todo.model';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(BooksApiActions.retrievedBookList, (_state, { books }) => books)
);

//Retrieved Book List