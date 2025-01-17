import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { EditorContent, useEditor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faP,
  faListUl,
  faListOl,
  faAlignRight,
  faAlignLeft,
  faAlignCenter,
} from "@fortawesome/free-solid-svg-icons";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import styled from "styled-components";

import { RootState } from "../../reducers";

import { Button } from "../styledExtending";

const BtnWrapper = styled.div`
  position: absolute;
  top: -100px;
  transform: translate(0, 0);
  width: 330px;
  border: 2px solid;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #ffffff;
  z-index: 10;
`;

const StyleBtn = styled(Button)`
  padding: 3px;
  margin: 4px 3px;
  border: 1px solid;
`;

const StyleInput = styled.input`
  background-color: #ffffff;
  padding: 3px;
  margin: 4px 3px;
  border-radius: 5px;
  border: 2px solid;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #555555;
    color: #ffffff;
  }
`;

const MenuBar: React.FC<any> = ({ editor, isShowBtn }) => {
  if (!editor) {
    return null;
  }

  return (
    <BtnWrapper
      className="btns"
      style={{ display: isShowBtn ? "block" : "none" }}
    >
      <StyleBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faBold} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faItalic} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </StyleBtn>

      <StyleBtn
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faP} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        H4
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        H5
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        H6
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faListUl} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faListOl} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        —
      </StyleBtn>
      <StyleBtn onClick={() => editor.chain().focus().setHardBreak().run()}>
        空白行
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faAlignLeft} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faAlignCenter} />
      </StyleBtn>
      <StyleBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        <FontAwesomeIcon icon={faAlignRight} />
      </StyleBtn>
      <StyleInput
        type="color"
        onInput={(event) =>
          editor
            .chain()
            .focus()
            .setColor((event.target as HTMLTextAreaElement).value)
            .run()
        }
        value={editor.getAttributes("textStyle").color}
      />
    </BtnWrapper>
  );
};

interface props {
  text: string;
  id: string;
  setReducerContent: (
    type: string,
    string: string,
    listIndex: number
  ) => Promise<void>;
  listIndex: number;
  style?: React.CSSProperties;
  index: number;
}

export default ({
  text,
  id,
  setReducerContent,
  listIndex,
  style,
  index,
}: props) => {
  const [isShowBtn, setIsShowBtn] = useState<boolean>(false);
  let isPreviewData = useSelector((state: RootState) => state.IsPreviewReducer);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: `
      ${text}
    `,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setReducerContent("text", html, listIndex);
      },
    },
    [index, listIndex]
  );

  const EditorContentStyle = {
    ...style,
    border:
      isPreviewData.resume && isPreviewData.website && isPreviewData.portfolio
        ? "0px"
        : "1px solid",
  };

  useEffect(() => {
    const closeBtn = (e: any) => {
      if (e.target.closest(`.text${id}${listIndex}`) !== null) {
        return;
      }
      setIsShowBtn(false);
    };
    document.body.addEventListener("click", closeBtn);
  }, []);

  return (
    <div className={`text${id}${listIndex}`}>
      <MenuBar editor={editor} isShowBtn={isShowBtn} />
      <EditorContent
        style={EditorContentStyle}
        editor={editor}
        onClick={() => {
          setIsShowBtn(true);
        }}
      />
    </div>
  );
};
