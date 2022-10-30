import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import styles from './ScriptLibrary.module.sass'
import { ArrowRight, ArrowDown } from 'react-feather';
import Icon from '../../components/icon/Icon';
import Section from '../../components/layout/section/Section';
import { AddButton } from '../../components/basic/button/Button';
import SearchBar from '../../components/basic/searchBar/SearchBar';
import Tags, { Tag } from '../../components/basic/tags/Tags';
import { ParameterDescription } from '../../components/basic/parameter/Parameter';

const data = {
  id: 'root',
  name: 'MOVEMENT',
  icon: <Icon color="#C5FF4A" size={11} icon="Human" />,
  children: [
    {
      id: '1',
      name: 'PlatformerJump',
      icon: <Icon color="#C5FF4A" size={11} icon="Human" />
    },
    {
      id: '3',
      name: 'PlatformerMove',
      icon: <Icon color="#C5FF4A" size={11} icon="Human" />
    },
  ],
};

export default function ScriptLibrary() {

  const renderTree = (nodes) => (
    <TreeItem className={styles.item} key={nodes.id} nodeId={nodes.id} label={nodes.name} icon={nodes.icon}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <div className={styles.window}>
      <div className={styles.nav}>
        <SearchBar />
        <div className={styles.tree}>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ArrowDown size={10} />}
            defaultExpandIcon={<ArrowRight size={10} />}
          >{renderTree(data)}</TreeView>
        </div>
        <AddButton label="CREATE SCRIPT" stretch></AddButton>
      </div>
      <div className={`${styles.content} ${styles.row}`}>
        <div className={styles.col}>
          <Section className={styles.name} title="name">
            <h1 className={styles.text}>PlatformerJump</h1>
          </Section>
          <div className={styles.row}>
            <Section className={styles.category} title="category">
              <Icon color="#C5FF4A" size={27} icon="Human" />
            </Section>
            <Section className={styles.tags} title="tags">
              <Tags>
                <Tag label="PLATFORMER" color="#C5FF4A" />
                <Tag label="FRAME" color="#9A068B" />
              </Tags>
            </Section>
          </div>
          <Section className={styles.parameters} title="parameters">
            <ParameterDescription name="keyDown" type="boolean" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
            <ParameterDescription name="keyUp" type="boolean" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" />

          </Section>
        </div>
        <div className={styles.col}>
          <Section className={styles.description} title="description">
            <h1 className={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </h1>
          </Section>
          <Section className={styles.demo} title="demonstration">
            <div className={styles.view}></div>
          </Section>
          <AddButton label="ADD SCRIPT" stretch></AddButton>
        </div>
      </div>
    </div>
  )
}
