import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

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
    <ul className="flex gap-2 grow">
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
    <div className="h-full w-full bg-bg">
      <div className="h-full w-full bg-bg overflow-hidden flex flex-col">
        <div className="flex">
          {/* space */}
          <div className="px-5"></div>
          {/* tabs */}
          <SortableList
            className="w-full"
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
          <div className="px-5"></div>
        </div>
        {/* content */}
        <div className="grow h-full w-full rounded-[27px] bg-cellbg overflow-hidden">
          {tabs[activeTab] && tabs[activeTab].component}
        </div>
      </div>
    </div>
  ) : (
    <div className="grow h-full w-full rounded-[27px] bg-cellbg overflow-hidden" />
  )
}

function Tab({ title, icon, active, onClick }) {
  return (
    <div onClick={onClick} className={`tab ${active ? "bg-cellbg text-cellbg" : "bg-unselectedTab text-unselectedTab"}`}>
      <h2 className="text-white font-semibold text-xs select-none">{title}</h2>
      <div className="text-white select-none text-xs">{icon}</div>
    </div>
  )
}
