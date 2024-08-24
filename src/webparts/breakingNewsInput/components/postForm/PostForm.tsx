import * as React from 'react';
import styles  from './PostForm.module.scss';
import { useState,useEffect } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {spInstanceUtil}  from '../../shared/utility/ContextUtil';
import { ITermInfo } from "@pnp/sp/taxonomy";
import { SPFI } from '@pnp/sp';
import { ChoiceGroup,  DialogType,  Dropdown, IChoiceGroupOption,IDialogContentProps,IDropdownOption,Label,Link,MessageBar,MessageBarType,PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react/lib';
import { CustomIcon } from '../Icon/CustomIcon';
//import { IClientsidePage } from "@pnp/sp/clientside-pages";
import { ClientsidePageFromFile, IClientsidePage } from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";

interface IPostType{   
    closeModalHandle: () => void;
    changeDialogContent :(value : IDialogContentProps) => void;
    currentContext:WebPartContext;
}

export interface IFormValues{
    frequency:string[];
    country: ITermInfo[];
}
export interface IUserSubscriptionDetail{
    Id?:number;
    Frequency:string[];
    Country:ITermInfo[] ;
 
}

interface IErrorMessage{
    message :string;
    status  :boolean;
    type : MessageBarType;
}

const PostForm = (props:IPostType): JSX.Element  =>{
    const [selectedOtion, setSelectedOption] = React.useState<string | undefined>('no');
    const [selecteDrpOption, setSelectedDrpOption] = React.useState<IDropdownOption>();
    const [isInvlidOption,setIsInvalidOption] = useState(false);
    const[options,setOptions] = useState<IChoiceGroupOption[]>([]);
    const[pageUrl,SetPageUrl] =useState("");

    const[disasterOptions,setDisasterOptions] = useState<IDropdownOption[]>([]);
    const[responseOptions,setResponseOptions] = useState<IDropdownOption[]>([]);

    const[isSubmitSuccessful,setIsSubmitSuccessful] = useState(false);
    const[isSubmitting,setIsSubmitting] = useState(false);
   const[isError, SetIsError] = useState<IErrorMessage>();
    const  spContext:SPFI  =  spInstanceUtil(props.currentContext) ;
    
    useEffect(()=>{
         const options: IChoiceGroupOption[] = [
            { key: 'yes', text: 'Yes' },
            { key: 'no', text: 'No' },
          ];        
          setOptions(options);

          spContext.web.lists.getByTitle("Disasters").items
          .select("Title")()
          .then((items)=>{
               const disasterOptions: IDropdownOption[]=[];              
               const uniqueTitles = new Set<string>();
               items.forEach((item)=>{
                  if (!uniqueTitles.has(item.Title)) {
                      uniqueTitles.add(item.Title);
                      disasterOptions.push({ key: item.Title, text: item.Title });
                  }
               });    
               setDisasterOptions(disasterOptions);
          }).catch((error)=>{
            console.log("Error during fetching Disaster Options");
          });

          spContext.web.lists.getByTitle("Response Tracker").items
          .select("Title")
          .filter("ContentType ne 'Response Re-declaration (for closed responses)' and ContentType ne 'Response Re-declaration (for active responses)' and ContentType ne 'Response Undeclaration'")()
          .then((items)=>{
            console.log(items);
               const responseOptions: IDropdownOption[]=[];
               const uniqueTitles = new Set<string>();
               items.forEach((item)=>{
                  if (!uniqueTitles.has(item.Title)) {
                      uniqueTitles.add(item.Title);
                      responseOptions.push({ key: item.Title, text: item.Title });
                  }
               });    
               setResponseOptions(responseOptions);
          }).catch((error)=>{
            console.log("Error during fetching Response Tracker options",error);
          });  
    },[]);

    useEffect(()=>{
        if(isSubmitting || isSubmitSuccessful)
        {
            props.changeDialogContent({
                type: DialogType.normal,
                title: '',
                subText: ''
            });
        }
        if( !isSubmitting && !isSubmitSuccessful){
            props.changeDialogContent({
                type: DialogType.largeHeader,
                title: 'Breaking News Input',
                subText: 'Please select below details',
              });
        }

    },[isSubmitting,isSubmitSuccessful])

    const onCreateRequest = async() : Promise<void> =>{
                if(!selecteDrpOption?.key)
                {
                    console.log(selectedOtion," Option")
                    setIsInvalidOption(true);
                    return;
                }
                setIsInvalidOption(false);
                console.log(selecteDrpOption);
                const sourceFileUrl = `/${props.currentContext.pageContext.web.serverRelativeUrl}/SitePages/Templates/TemplatePageCustom.aspx`;
                const now = new Date();
                const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, '');
                const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '');
                const timestamp = `${formattedDate}${formattedTime}`;
                const destinationFileUrl = `${props.currentContext.pageContext.web.serverRelativeUrl}/SitePages/${timestamp}.aspx`;

                try{
                    setIsSubmitting(true);
                    await spContext.web.getFileByServerRelativePath(sourceFileUrl).copyTo(destinationFileUrl, true);
                    const pageItem:any = await spContext.web.getFileByServerRelativePath(destinationFileUrl).getItem();
                    console.log("pageItem",pageItem.ID,destinationFileUrl);
                    const result = await spContext.web.lists.getByTitle('Site Pages').items.getById(pageItem.ID).update({
                        "Disaster" : selectedOtion === 'yes'? selecteDrpOption.key : null,
                        "Response" : selectedOtion === 'no'? selecteDrpOption.key : null
                    });
                    
                    const page: IClientsidePage =  await ClientsidePageFromFile(spContext.web.getFileByServerRelativePath(destinationFileUrl));
                    await page.promoteToNews();
                    await page.disableComments();
                                        
                    setIsSubmitting(false);
                    setIsSubmitSuccessful(true);
                    SetIsError(undefined);
                    SetPageUrl(`${props.currentContext.pageContext.web.absoluteUrl}/SitePages/${timestamp}.aspx`);
                    console.log("File copied successfully.",result);
                }
                catch(error){
                    setIsSubmitting(false);
                    setIsSubmitSuccessful(false);
                    SetIsError({
                        message : "Error : Not able to create page.",
                        status:true,
                        type : MessageBarType.error
                    });
                    console.error("Error copying file:", error);
                }
    }

    
   useEffect(()=>{
        if(isSubmitSuccessful)
        {           
           console.log("Submitted Successful"); 
        }
    },[isSubmitSuccessful])
    
    const resetMessageBar = ():void =>{
        SetIsError(undefined);       
    };

    return(  
        <>
            { !isSubmitting && !isSubmitSuccessful &&         
                <>         
                        <div className={styles.postFormContainer}>    
                            { isError &&    
                            <MessageBar 
                                messageBarType={isError.type} 
                                onDismiss={resetMessageBar} 
                                dismissButtonAriaLabel='close' 
                                isMultiline={false} 
                            >{isError.message}
                            </MessageBar> 
                            }                
                            <div className={styles.postFormContainerMainContainer}>  
                        
                            <ChoiceGroup selectedKey={selectedOtion} 
                                options={options} 
                                onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption)=>{
                                    setSelectedOption(option?.key);
                                }} 
                                label="Is this breaking news occurring within a declared emergency?" 
                            />
                            {selectedOtion === 'yes' ?
                                <Dropdown
                                    label="Select Disaster"
                                    onChange={(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption)=>{                                   
                                        setSelectedDrpOption(option);                                      
                                    }}
                                    placeholder="Select an option"
                                    options={disasterOptions}                               
                            />
                            :  
                            <Dropdown
                                    label="Select Response"
                                    onChange={(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption)=>{                                   
                                        setSelectedDrpOption(option);                                      
                                    }}
                                    placeholder="Select an option"
                                    options={responseOptions}                               
                            />
                             
                            }
                            {isInvlidOption && <div className={styles.primaryDropdownError}>{selectedOtion === 'yes'? 'Disaster' : 'Response' } is required.</div>}  
                            </div>                    
                            <div className={styles.postFormContainerBottomContainer}>
                                <PrimaryButton  type="button" disabled={false} text="Submit" onClick={onCreateRequest}/>   
                                <PrimaryButton  type="button" disabled={false} text="Cancel" onClick={props.closeModalHandle}/>   
                            </div>   
                        </div>   
                </>    
            }  
             { isSubmitting && !isSubmitSuccessful &&         
                <>         
                        <div className={styles.postMsgContainer}>                     
                             <Spinner label="Submitting Request..."  size={SpinnerSize.large}/>
                        </div>   
                </>    
            }  
             { !isSubmitting && isSubmitSuccessful &&         
                <>         
                        <div className={styles.postMsgContainer}>                     
                            <CustomIcon />


                            <Label>New Page Successfully Created</Label>
                            <Link href={pageUrl} underline>
                                    Click here to view
                            </Link>

                        </div>   
                </>    
            }  
        </>
       
    );
}

export default PostForm;