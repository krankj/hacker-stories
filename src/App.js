import React from "react";
import axios from "axios";
import styles from "./App.module.css";
import { List } from "./List.js";
import SearchForm from "./SearchForm";
import LastSearchButton from "./LastSearchButton";
import InputWithLabel from "./InputWithLabel";
// type Story = {
//   objectID: string;
//   url: string;
//   title: string;
//   author: string;
//   num_comments: number;
//   points: number;
// };

// type SortObj = {
//   sortOnColumn: string;
//   sortAsc: boolean;
// };

// type InputWithLabelProps = {
//   id: string;
//   value: string;
//   type?: string;
//   onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   isFocused?: boolean;
//   children: React.ReactNode;
// };

// type StoriesState = {
//   data: Stories;
//   isLoading: boolean;
//   isError: boolean;
// };
// type Stories = Array<Story>;

// type ListProps = {
//   list: Stories;
//   onRemoveItem: (item: Story) => void;
// };

// type SearchFormProps = {
//   searchTerm: string;
//   onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
// };

// interface StoriesFetchInitAction {
//   type: "STORIES_FETCH_INIT";
// }
// interface StoriesFetchSuccessAction {
//   type: "STORIES_FETCH_SUCCESS";
//   payload: Stories;
// }
// interface StoriesFetchFailureAction {
//   type: "STORIES_FETCH_FAILURE";
// }
// interface StoriesRemoveAction {
//   type: "REMOVE_STORY";
//   payload: Story;
// }

// interface StoriesSortAction {
//   type: "SORT_STORIES";
//   payload: SortObj;
// }

// type StoriesAction =
//   | StoriesFetchInitAction
//   | StoriesFetchSuccessAction
//   | StoriesFetchFailureAction
//   | StoriesRemoveAction
//   | StoriesSortAction;
// type ItemProps = {
//   item: Story,
//   onRemoveItemLast: (item: Story) => void,
// };

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_SUCCESS":
      let concatedResult = [...state.data, ...action.payload.data];
      return {
        ...state,
        data: action.payload.page === 0 ? action.payload.data : concatedResult,
        isLoading: false,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (item) => action.payload.objectID !== item.objectID
        ),
      };
    case "STORIES_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };

    default:
      throw new Error("Something went wrong");
  }
};
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );

    const isMounted = React.useRef(false);
    React.useEffect(() => {
      if (isMounted.current) {
        localStorage.setItem(key, value);
      } else {
        isMounted.current = true;
      }
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [lastSearchedTerm, setLastSearchedTerm] = React.useState("");
  const [searchTermCache, setSearchTermCache] = React.useState([]);
  const [titleSearch, setTitleSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}&page=${page}`
  );

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  async function testCallBack() {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(`${url}&page=${page}`);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: { data: result.data.hits, page: page },
      });
      setLastSearchedTerm(searchTerm);
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }

  const handleFetchStories = React.useCallback(testCallBack, [page, url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleTitleSearch = (event) => {
    setTitleSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    if (lastSearchedTerm !== searchTerm) {
      setSearchTermCache((prevSearch) => {
        let newSearch = [...prevSearch];
        if (newSearch.length >= 5) {
          newSearch.shift();
          newSearch.splice(4, 1, lastSearchedTerm);
        } else {
          newSearch = [...prevSearch, lastSearchedTerm];
        }
        return newSearch;
      });
    }
    setPage(0);
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  // const searchedList = () =>
  //   stories.data.filter((story) => {
  //     console.log("Running filter");
  //     return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  //   });

  const handleRemoveStory = React.useCallback((item) => {
    navigator.vibrate =
      navigator.vibrate ||
      navigator.webkitVibrate ||
      navigator.mozVibrate ||
      navigator.msVibrate;

    if (navigator.vibrate) {
      navigator.vibrate(1000);
    }
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBackButton = () => {
    let prevValue = searchTermCache.pop();
    setSearchTerm(prevValue);
    setUrl(`${API_ENDPOINT}${prevValue}`);
  };

  const [isFetching, setIsFetching] = React.useState(false);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.scrollHeight
    )
      return;
    setIsFetching(true);
  };

  function fetchItems() {
    setPage((prevPage) => prevPage + 1);
    setIsFetching(false);
  }

  React.useEffect(() => {
    if (!isFetching) return;
    fetchItems();
  }, [isFetching]);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Or React.useCallBack(getSumComments(stories), [stories]);
  //const sumComments = React.useMemo(() => getSumComments(stories), [stories]);
  return (
    <div className={styles.rootContainer}>
      <div className={styles.container}>
        <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSubmit={handleSubmit}
        />
        <LastSearchButton
          enabled={searchTermCache.length !== 0}
          onBackButtonClick={handleBackButton}
        />
        <div className={styles.titleSearchBar}>
          <InputWithLabel
            onInputChange={handleTitleSearch}
            id="titleSearch"
            isFocused={false}
            value={titleSearch}
          >
            Title:
          </InputWithLabel>
        </div>
        {stories.isLoading ? (
          <p>Loading...</p>
        ) : stories.isError ? (
          <p> Error while fetching data :( </p>
        ) : (
          <>
            <List list={stories.data} onRemoveItem={handleRemoveStory} />
            {isFetching && "Fetching more items..."}
          </>
        )}
      </div>
    </div>
  );
};

// const initialStories = [
//   {
//     title: "React",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
//   {
//     title: "Real",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 2,
//   },
//   {
//     title: "Red",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 3,
//   },
//   {
//     title: "Rent",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 4,
//   },
//   {
//     title: "Rexona",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 5,
//   },
//   {
//     title: "Redeem",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 6,
//   },
//   {
//     title: "Redemption",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 7,
//   },
// ];

// const getAsyncStories = () =>
//   new Promise((resolve, error) => {
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
//   });

export { App as default, storiesReducer };
