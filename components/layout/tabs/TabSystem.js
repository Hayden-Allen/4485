import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import styles from './TabSystem.module.sass'

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};


const SortableItem = SortableElement(({ tab, active, onClick }) => (
  <Tab
    title={tab.title}
    icon={tab.icon}
    active={active}
    onClick={onClick}
  />
));

const SortableList = SortableContainer(({ tabs, activeTab, onTabClick }) => {
  return (
    <ul className={styles.list}>
      {tabs.map((tab, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          tab={tab}
          active={activeTab == index}
          onClick={() => onTabClick(index)}
        />
      ))}
    </ul>
  );
});

export default function TabSystem({ initialTabs }) {
  const [tabs, setTabs] = useState([...initialTabs])
  const [activeTab, setActiveTab] = useState(0)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setTabs(tbs => array_move(tbs, oldIndex, newIndex));
    if (oldIndex == activeTab) setActiveTab(newIndex)
    else if (oldIndex < activeTab && newIndex > activeTab) setActiveTab(activeTab - 1)
    else if (oldIndex > activeTab && newIndex < activeTab) setActiveTab(activeTab + 1)
  };

  const onTabClick = index => {
    console.log(index + " got clicked")
    setActiveTab(index)
  }

  return tabs.length > 0 ? (
    <div className={styles.window}>
      <div className={styles.tabs_column}>
        <div className={styles.tabs}>
          {/* space */}
          <div className={styles.space}></div>
          {/* tabs */}
          <SortableList
            className={styles.sortable_list}
            lockToContainerEdges={true}
            lockOffset={["0%", "0%"]}
            axis="x"
            lockAxis="x"
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={onTabClick}
            onSortEnd={onSortEnd}
            distance={5}
          />
          {/* space */}
          <div className={styles.space}></div>
        </div>
        {/* content */}
        <div className={styles.content}>
          {tabs[activeTab] && tabs[activeTab].component}
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.content} />
  )
}

function Tab({ title, icon, active, onClick }) {
  return (
    <div onClick={onClick} className={`${styles.tab} ${active ? styles.selected : styles.unselected}`}>
      <h2 className={styles.label}>{title}</h2>
      <div className={styles.svg}>{icon}</div>
    </div>
  )
}
