import React from "react";

function withLoading(Component) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <h2> Loading...</h2>;
    }
    return <Component {...props} />;
  };
}

const initialNames = [
  {
    name: "Sudarshan",
    email: "kjsudi@gmail.com",
    id: 1,
  },
  {
    name: "Srinivas",
    email: "srinivaskjcse@gmail.com",
    id: 2,
  },
];

function Hoc() {
  const [names, setNames] = React.useState(initialNames);
  const ListWithLoading = withLoading(List);

  const handleOnDelete = (item) => {
    const newNames = names.filter((name) => name.id !== item.id);
    setNames(newNames);
  };

  return (
    <ListWithLoading isLoading={false} list={names} onDelete={handleOnDelete} />
  );
}

const List = ({ list, onDelete }) =>
  list.map((listItem) => (
    <Item key={listItem.id} item={listItem} onDelete={onDelete} />
  ));

const Item = ({ item, onDelete }) => (
  <div>
    <span>{item.name}</span>
    <span>{item.email}</span>
    <span>
      <button type="button" onClick={() => onDelete(item)}>
        Delete
      </button>
    </span>
  </div>
);

export default Hoc;
