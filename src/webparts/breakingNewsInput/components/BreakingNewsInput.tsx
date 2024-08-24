import * as React from 'react';
import type { IBreakingNewsInputProps } from './IBreakingNewsInputProps';
import { useState } from 'react';
import ModalDialog from '../components/modelDialog/ModalDialog';
import Container from './container/Container';
import "@pnp/graph/taxonomy";
import { DialogType, IDialogContentProps, PrimaryButton } from '@fluentui/react';
import PostForm from './postForm/PostForm';


const BreakingNewsInput:React.FC<IBreakingNewsInputProps> = (props:IBreakingNewsInputProps)=>{
    const[hidden,setHidden] = useState<boolean>(true); 
    const[dialogContent,SetDialogContent] = useState<IDialogContentProps>({
        type: DialogType.largeHeader,
        title: 'Breaking News Input',
        subText: 'Please select below details',
      });

    const chnageDialogConfig = (value : IDialogContentProps) : void =>{
      SetDialogContent(value);
    }
  
    const handleShowModal = () : void =>{
                 
                  try{
                   
                    setHidden(!hidden);                 
                    console.log("showhidden",hidden) ;
                     
                                                
                  }catch(error){                  
                    console.log("Error");                      
                  }  
          
           
    }
//
  
    return (
      <>
          <PrimaryButton text="New Click Me" disabled={false} type="button" onClick={()=>handleShowModal()} />   
          
          <ModalDialog open={hidden} dialogContentProps={dialogContent} closeModalHandle={()=>handleShowModal()} >
            <Container>
              <PostForm closeModalHandle={()=>handleShowModal()} currentContext={props.currentContext} changeDialogContent={chnageDialogConfig}/>
            </Container>
          </ModalDialog>  
      </>
    );
  
}

export default BreakingNewsInput;
