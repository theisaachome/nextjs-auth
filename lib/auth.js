import {Lucia} from "lucia";
import {BetterSqlite3Adapter} from "@lucia-auth/adapter-sqlite"
import db from "./db";
import { cookies } from "next/headers";

const adapter = new BetterSqlite3Adapter(db,{user:"users",session:"sessions"});

const lucia = new Lucia(adapter,{
    sessionCookie:{
        expires:false,
        attributes:{
            secure:process.env.NODE_ENV==="production",
            // sameSite:"strict",
            // httpOnly:true,
        },
        // name:"auth_session",
        // httpOnly:true,
        // sameSite:"strict",
        // secure:true,
        // maxAge:60*60*24*30,
    }
});

export async function createAuthSession(userId){
   const session=await lucia.createSession(userId,{});
   const sessionCookie= lucia.createSessionCookie(session.id,{});
   cookies().set(sessionCookie.name,sessionCookie.value,sessionCookie.attributes);
}
export async function verifyAuth(){

    const sessionCookie=cookies().get(lucia.sessionCookie.name)
    if (!sessionCookie) {
      return {
        user: null,
        session: null,
      };
    }
    const sessionId = sessionCookie.value;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
    const result = await lucia.validateSession(sessionId);
    try {
          if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes
            );
          }
          if(!result.session){
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
              sessionCookie.name,
              sessionCookie.value,
              sessionCookie.attributes
            );
          }
    } catch (error) {
        
    }
    return result;
}