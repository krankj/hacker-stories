import React from "react";
import styles from "./App.module.css";
import { ReactComponent as Dismiss } from "./close.svg";
import SortButton from "./SortButton";
import { sortBy } from "lodash";

const List = React.memo(({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState(
    JSON.parse(localStorage.getItem("sortInfo")) || {
      sortOnColumn: "NONE",
      sortAsc: true,
    }
  );

  React.useEffect(() => {
    localStorage.setItem("sortInfo", JSON.stringify(sort));
  }, [sort]);

  const SORT = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, "title"),
    AUTHOR: (list) => sortBy(list, "author"),
    COMMENTS: (list) => sortBy(list, "num_comments"),
    POINTS: (list) => sortBy(list, "points"),
  };

  const sortFunction = SORT[sort.sortOnColumn];

  const sortedList = sort.sortAsc
    ? sortFunction(list)
    : sortFunction(list).reverse();

  const handleSort = (sortOnColumn) => {
    setSort((prevState) =>
      prevState.sortOnColumn !== sortOnColumn
        ? { ...prevState, sortOnColumn }
        : { ...prevState, sortAsc: !prevState.sortAsc }
    );
  };

  const headers = [
    {
      id: 1,
      title: "Title",
      width: "40%",
    },
    {
      id: 2,
      title: "Author",
      width: "30%",
    },
    {
      id: 3,
      title: "Comments",
      width: "10%",
    },
    {
      id: 4,
      title: "Points",
      width: "10%",
    },
  ];

  headers.map((header) => {
    if (sort.sortOnColumn === header.title.toUpperCase()) {
      header.visible = true;
    } else header.visible = false;
    return header;
  });

  return (
    <>
      <div className={styles.sortHeader}>
        {headers.map((header) => {
          return (
            <span style={{ width: header.width }}>
              <SortButton
                sortAsc={sort.sortAsc}
                key={header.id}
                visible={header.visible}
                onSortHandler={handleSort}
              >
                {header.title}
              </SortButton>
            </span>
          );
        })}
      </div>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItemLast={onRemoveItem} />
      ))}
    </>
  );
});
const Item = ({ item, onRemoveItemLast }) => (
  <div className={styles.item}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>

    <span style={{ width: "30%" }}>{item.author}</span>

    <span style={{ width: "10%" }}>{item.num_comments}</span>

    <span style={{ width: "10%" }}>{item.points}</span>

    <span style={{ width: "10%" }}>
      <button
        className={`${styles.button} ${styles.buttonSmall}`}
        type="button"
        onClick={() => onRemoveItemLast(item)}
      >
        <Dismiss height="14px" width="14px" />
      </button>
    </span>
  </div>
);

export { List, Item };
