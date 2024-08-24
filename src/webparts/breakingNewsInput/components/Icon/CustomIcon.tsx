import * as React from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const iconClass = mergeStyles({
  fontSize: 50,
  height: 50,
  width: 50,
  margin: '0 25px',
  color: 'deepskyblue' 
})

export const CustomIcon: React.FunctionComponent = () => {
  // FontIcon is an optimized variant of standard Icon.
  // You could also use the standard Icon here.
  // Provide an `aria-label` for screen reader users if the icon is not accompanied by text
  // that conveys the same meaning.
  return (
    <>     
      <FontIcon aria-label="" iconName="CompletedSolid" className={iconClass} />
    </>
  );
};
