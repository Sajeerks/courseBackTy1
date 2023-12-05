// import express from "express";

// declare global {
//     namespace Express {
//       interface Request {
//         user?: Record<string,any>
//       }
//     }
//   }

declare namespace Express {
    export interface Request {
        user: any;
    }
    export interface Response {
        user: any;
    }
  }
