import React from "react";

function App2() {
  const initialStories = [
    {
      name: "Sudarsdhan",
      id: 1,
      brother: "Srinivas",
    },
    {
      name: "Srinivas",
      id: 2,
      brother: "Sudarshan",
    },
    {
      name: "Usha Janardhan",
      id: 3,
      brother: "Rangaraj",
    },
    {
      name: "KN Janardhana",
      id: 4,
      brother: "Yogu",
    },
  ];

  const useSemiPersistentState = (key, initialValue) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialValue
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function getAsyncStories() {
    await wait(2000);
    return {
      data: {
        stories: initialStories,
      },
    };
  }

  // function getStoriesAsync() {
  //   return new Promise((r) => {
  //     setTimeout(() => {
  //       r({ data: { stories: initialStories } });
  //     }, 2000);
  //   });
  // }

  // React.useEffect(() => {
  //   getAsyncStories().then((result) => setStories(result.data.stories));
  // }, []);

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    async function callMe() {
      const result = await getAsyncStories();
      setStories(result.data.stories);
    }
    callMe();
  }, []);

  const searchStories = () =>
    stories.filter(
      (story) => matches(story, "name") || matches(story, "brother")
    );

  const matches = (story, key) =>
    story[key].toLowerCase().includes(searchTerm.toLowerCase());

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOnRemove = (item) => {
    const newList = stories.filter((story) => story.id !== item.id);
    setStories(newList);
  };
  return (
    <>
      <InputFieldWithLabel
        id="search"
        isFocused
        value={searchTerm}
        onInputChange={handleInputChange}
      >
        Search:
      </InputFieldWithLabel>
      <hr />
      <List stories={searchStories()} onRemove={handleOnRemove} />
    </>
  );
}

const InputFieldWithLabel = ({
  id,
  type = "text",
  value,
  isFocused,
  children,
  onInputChange,
}) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        id={id}
        htmlFor={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
      <h4>Searching for: {value}</h4>
    </>
  );
};

const List = ({ stories, onRemove }) =>
  stories.map((story) => (
    <Item key={story.id} item={story} onRemove={onRemove} />
  ));

const Item = ({ item, onRemove }) => {
  return (
    <div>
      <span>{item.name}</span>
      &nbsp;&nbsp;
      <span>{item.brother}</span>
      &nbsp;&nbsp;
      <span>
        <button type="button" onClick={() => onRemove(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};

export default App2;
