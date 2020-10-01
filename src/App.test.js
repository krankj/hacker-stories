import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import App, { storiesReducer } from "./App";

import { List, Item } from "./List.js";
import InputWithLabel from "./InputWithLabel.js";
import SearchForm from "./SearchForm.js";

import axios from "axios";
jest.mock("axios");

const storyOne = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("Component testing", () => {
  test("Render Item component", () => {
    render(<Item item={storyOne} />);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://reactjs.org/"
    );
  });
  test("Make sure there is a dismiss button", () => {
    render(<Item item={storyOne} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
  test("Clicking dismiss causes the callback handler", () => {
    const onDismissHandler = jest.fn();
    render(<Item item={storyOne} onRemoveItemLast={onDismissHandler} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onDismissHandler).toHaveBeenCalledTimes(1);
  });
});

describe("App component", () => {
  test("Data fetch success", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    await act(() => promise);
    expect(screen.queryByText(/Loading/)).toBe(null);
    expect(screen.getAllByText("React")[0]).toBeInTheDocument();
    expect(screen.getByText("Redux")).toBeInTheDocument();
    expect(screen.getAllByText("check.svg").length).toBe(2);
  });

  test("Data fetch failure", async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    try {
      await act(() => promise);
    } catch {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Error/)).toBeInTheDocument();
    }
  });

  test("Removes a story from the app component", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    await act(() => promise);
    expect(screen.getAllByText("check.svg").length).toBe(2);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("check.svg")[0]);
    expect(screen.getAllByText("check.svg").length).toBe(1);
    expect(screen.queryByText("Jordan Walke")).not.toBeInTheDocument();
  });

  test("Search for a component and render a new list", async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: "JavaScript",
      url: "https://en.wikipedia.org/wiki/JavaScript",
      author: "Brendan Eich",
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) =>
      url.includes("React")
        ? reactPromise
        : url.includes("JavaScript")
        ? javascriptPromise
        : () => {
            throw Error();
          }
    );

    render(<App />);

    await act(() => reactPromise);

    expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("JavaScript")).toBeNull();

    expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
    expect(screen.queryByText("Brendan Eich")).toBeNull();

    fireEvent.change(screen.queryByDisplayValue("React"), {
      target: {
        value: "JavaScript",
      },
    });

    expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("React")).toBeNull();

    fireEvent.submit(screen.queryByText("Submit"));

    await act(() => javascriptPromise);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
  });

  test("App snapshot component", async () => {
    const { container } = render(<App />);
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    await act(() => promise);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("Search Component ", () => {
  const searchFromProps = {
    searchTerm: "React",
    onSubmit: jest.fn(),
    onSearchInput: jest.fn(),
  };
  test("Render search component", () => {
    render(<SearchForm {...searchFromProps} />);

    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });
  test("Renders the correct label", () => {
    render(<SearchForm {...searchFromProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test("Trigger onSearchInput for a field update", () => {
    render(<SearchForm {...searchFromProps} />);
    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });
    expect(searchFromProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test("Trigger onSubmit when the button is clicked", () => {
    render(<SearchForm {...searchFromProps} />);
    fireEvent.submit(screen.getByRole("button"));
    expect(searchFromProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  test("Snapshot test", () => {
    const { container } = render(<SearchForm {...searchFromProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("Stories Reducer", () => {
  test("Removes a story from the story list", () => {
    const state = { data: stories, isLoading: false, isError: false };
    const action = { type: "REMOVE_STORY", payload: storyTwo };
    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyOne],
      isLoading: false,
      isError: false,
    };
    expect(newState).toStrictEqual(expectedState);
  });

  test("Fetch init", () => {
    const state = { data: stories, isLoading: false, isError: false };
    const action = { type: "STORIES_FETCH_INIT" };
    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories,
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test("Fetch failed", () => {
    const state = { data: stories, isLoading: false, isError: false };
    const action = { type: "STORIES_FETCH_FAILURE" };
    const newState = storiesReducer(state, action);
    const expectedState = { data: stories, isLoading: false, isError: true };
    expect(newState).toStrictEqual(expectedState);
  });

  test("Fetch Success", () => {
    const state = { data: [], isLoading: false, isError: false };
    const action = { type: "STORIES_FETCH_SUCCESS", payload: stories };
    const newState = storiesReducer(state, action);
    const expectedState = { data: stories, isLoading: false, isError: false };
    expect(newState).toStrictEqual(expectedState);
  });
});
