import { useDispatch } from "react-redux";
import { resumeFillContent } from "../../../action";
import { resumeComContent } from "../Resume";
import { setEditContentReducer } from "../../../utilis/editLayoutFunction";

function useUpdateResumeData({
  index,
  content,
}: {
  index: number;
  content: resumeComContent;
}) {
  const diapatch = useDispatch();

  const setReducerContent = async (
    type: string,
    string: string,
    listIndex: number
  ) => {
    const newArr = await setEditContentReducer(string, listIndex, content);
    diapatch(resumeFillContent(type, index, newArr));
  };

  return {
    setReducerContent: setReducerContent,
  };
}

export default useUpdateResumeData;
