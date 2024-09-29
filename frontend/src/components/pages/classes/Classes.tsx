import React from 'react'
import ClassContainer from '../../organisms/ClassContainer';
import ClassList from '../../organisms/classesList/ClassList';
import useData from '../../../hooks/UseData';

export default function Classes() {

  const { classes } = useData();
  
  return (
    <>
      <ClassList classes={classes}/>
      <ClassContainer />
    </>
  );
}
