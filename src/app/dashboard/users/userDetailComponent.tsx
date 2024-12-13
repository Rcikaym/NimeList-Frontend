import Image from "next/image";
import { UserDetail } from "./user";
import {
  BiAlignLeft,
  BiBookmarkHeart,
  BiCart,
  BiCommentDetail,
  BiCrown,
  BiDiamond,
  BiGlobe,
  BiHappyAlt,
} from "react-icons/bi";

const UserDetailComponent = ({ data }: { data: UserDetail }) => {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const sizeIcon = 25;

  const cardData = [
    {
      title: "Reviews Created",
      value: data.review_created,
      icon: <BiHappyAlt size={sizeIcon} />,
    },
    {
      title: "Comments Created",
      value: data.comment_created,
      icon: <BiCommentDetail size={sizeIcon} />,
    },
    {
      title: "Favorited Anime",
      value: data.favorite_anime,
      icon: <BiBookmarkHeart size={sizeIcon} />,
    },
    {
      title: "Transactions Created",
      value: data.transaction_created,
      icon: <BiCart size={sizeIcon} />,
    },
    {
      title: "Topics Created",
      value: data.topic_created,
      icon: <BiAlignLeft size={sizeIcon} />,
    },
  ];

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
        <div className="gap-5 grid grid-cols-2">
          {cardData.map((card, index) => (
            <div
              className="bg-white border border-emerald-700 rounded-lg shadow-md p-2 h-[6rem]"
              key={index}
            >
              <div className="flex items-center h-full gap-4">
                <div className="bg-emerald-700 text-white rounded-lg p-3 shadow-md shadow-gray-300 transition-all duration-500 ease-in-out transform hover:scale-90">
                  {card.icon}
                </div>
                <div className="flex flex-col text-emerald-700">
                  <span className="text-small">{card.title}</span>
                  <span className="text-lg font-bold">{card.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailComponent;
