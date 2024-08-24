import * as React from 'react';

interface ContainerProps {
    children: React.ReactNode;   
}

const Container : React.FC<ContainerProps> = (props:ContainerProps) =>{
       return (
        <>           
            {props.children}
        </>
    )
}

export default Container;