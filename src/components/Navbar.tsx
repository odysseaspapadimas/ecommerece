import MaxWidthWrapper from "./MaxWidthWrapper";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, getUser, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  const user = await getUser();

  console.log(user, "user");
  return (
    <MaxWidthWrapper className="mb-4">
      <div className="flex h-20 items-center justify-between">
        <Link href="/">
          <h2 className="font-semibold text-2xl">Commercio</h2>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger>
            {session ? (
              <Image
                src={session.user?.image!}
                alt="userimage"
                width={42}
                height={42}
                className="rounded-sm"
              />
            ) : (
              <div className="border border-gray-300 rounded-sm p-2">
                <User />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session ? (
              <>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button type="submit">Sign Out</button>
                  </form>
                </DropdownMenuItem>
                {session?.user.isAdmin && (
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
              </>
            ) : (
              <DropdownMenuItem>
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                >
                  <button type="submit">Sign-in with Google</button>
                </form>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-[1px] bg-slate-300" />
    </MaxWidthWrapper>
  );
};
export default Navbar;
