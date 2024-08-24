import * as React from 'react';
import {Dialog, IDialogContentProps} from '@fluentui/react';

interface IModalDialog{
  children: React.ReactNode,
  open:boolean,
  dialogContentProps : IDialogContentProps,
  closeModalHandle : () => void
}

const ModalDialog = (props:IModalDialog): JSX.Element  =>{
    const {
        children,
        open,
        dialogContentProps,
        closeModalHandle          
    }=props;
    
   
    return(
        <div>
          <Dialog
            dialogContentProps={dialogContentProps}
            hidden={open}
            onDismiss={closeModalHandle}
            modalProps={{
              isBlocking: true,           
              styles: {
                main: {
                  selectors: {
                    ['@media (min-width: 480px)']: {
                      minWidth: 550 
                     
                    }
                  }
                }
              }
            }}
          >
            {children}
          </Dialog>
        </div>

    )

} 

export default ModalDialog;