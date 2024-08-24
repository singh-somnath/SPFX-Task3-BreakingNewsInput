import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPFI, spfi,SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import  "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";


export const spInstanceUtil = (_context : WebPartContext):SPFI  =>{
    const _sp = spfi().using(spSPFx(_context));
    return _sp;
   
};
