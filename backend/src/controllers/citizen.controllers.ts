import {Request, Response} from 'express'
export const entryController = (req: Request, res: Response)=>{
    res.send("Entry to the citizens route. Auth Pending!")
}

export const allCitizens = (req: any, res: Response)=>{
    console.log('hello ')
    res.send("All registered citizens. Auth pending")
}