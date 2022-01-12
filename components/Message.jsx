import moment from 'moment';
import { useSession } from 'next-auth/react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useRecoilState } from 'recoil';
import { channelState } from '../atoms/channelAtom';

export default function Message({ data, id }) {
  const { data: session } = useSession();
  const [channelInfo] = useRecoilState(channelState);

  const deleteChat = () => {
    deleteDoc(doc(db, 'channels', channelInfo.channelId, 'messages', id));
  };

  if (data.email == session?.user.email)
    return (
      <div className="flex group items-center justify-end space-x-2 p-4 hover:bg-slate-300 overflow-y-scroll scrollbar-hide">
        <div
          onClick={deleteChat}
          className="hidden group-hover:block mr-auto cursor-pointer font-medium text-blue-600 hover:underline"
        >
          <h3>DELETE</h3>
        </div>
        <div>
          <h3 className=" font-bold text-blue-900 text-2xl">{data.message}</h3>
          <h4 className=" text-blue-600 text-sm">
            {moment(data.timestamp?.toDate().getTime()).format('lll')}
          </h4>
        </div>
        <div>
          <img
            src={data.photoUrl}
            alt=""
            className=" h-14 rounded-full border-2 border-blue-600"
          />
        </div>
      </div>
    );
  return (
    <div className="flex items-center justify-start space-x-2 p-4 hover:bg-slate-300 overflow-y-scroll scrollbar-hide">
      <div>
        <img
          src={data.photoUrl}
          alt=""
          className=" h-14 rounded-full border-2 border-blue-600"
        />
      </div>
      <div>
        <h3 className=" font-bold text-blue-900 text-2xl">{data.message}</h3>
        <h4 className=" text-blue-600 text-sm">
          {moment(data.timestamp?.toDate().getTime()).format('lll')}
        </h4>
      </div>
    </div>
  );
}
