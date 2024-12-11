import Image from "next/image";
import { UserDetail } from "./user";
import { BiCrown, BiDiamond, BiGlobe } from "react-icons/bi";

const UserDetailComponent = ({ data }: { data: UserDetail }) => {
  const api = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2 items-center">
        <div className="w-40 h-40 relative">
          <Image
            src={
              data.photo_profile === null
                ? "/images/logo-admin.jpeg"
                : `${api}/${data.photo_profile}`
            }
            alt="Profile"
            className="rounded-full border-2 border-gray-300 m-0"
            loading="lazy"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col gap-2 ml-5">
          <div className="flex w-fit items-center gap-2 bg-[#005B50] rounded-md px-3 py-1 text-white mb-5">
            <span className="text-lg font-sans font-semibold">{data.name}</span>
            {data.badge === "NimeList Heroes" ? (
              <BiCrown size={20} className="text-yellow-300" />
            ) : (
              <BiGlobe size={20} className="text-[#05E5CB]" />
            )}
          </div>
          <span className="text-black text-sm">{`@${data.username}`}</span>
          <div className="flex flex-col">
            <span className="text-black text-sm">{data.email}</span>
          </div>
        </div>
      </div>
      <div className="my-5 gap-3">
        <h2 className="text-xl font-semibold">Bio</h2>
        {data.bio === null ? <span>No Bio</span> : <span>{data.bio}</span>}
      </div>
      <div className="mb-5 gap-3">
        <h2 className="text-xl font-semibold">Activities</h2>
        <div className="flex gap-5">
          <div className="flex flex-col gap-2">
            <span>{`Comment Created`}</span>
            <span>{`Favorite Anime`}</span>
            <span>{`Review Created`}</span>
            <span>{`Topic Created`}</span>
            <span>{`Transaction Created`}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span>{`:`}</span>
            <span>{`:`}</span>
            <span>{`:`}</span>
            <span>{`:`}</span>
            <span>{`:`}</span>
          </div>
          <div className="flex flex-col gap-2 font-semibold">
            <span>{data.comment_created}</span>
            <span>{data.favorite_anime}</span>
            <span>{data.review_created}</span>
            <span>{data.topic_created}</span>
            <span>{data.transaction_created}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailComponent;
