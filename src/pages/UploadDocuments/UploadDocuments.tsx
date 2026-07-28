import { useState } from "react";
import api from "../../services/api";

export default function UploadDocuments() {

  const [mode, setMode] = useState<"file" | "text">("file");

  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const handleCreateRecord = async () => {

    try {

      setLoading(true);
      setMessage("");



      const userId =
        localStorage.getItem("user_id");


      const deviceId =
        localStorage.getItem("device_id");



      if (!userId) {

        setMessage(
          "User not logged in. Please login again."
        );

        return;

      }



      if (!deviceId) {

        setMessage(
          "Device not found. Please login again."
        );

        return;

      }



      let recordData;



      if (mode === "file") {


        if (!file) {

          setMessage(
            "Please select a file."
          );

          return;

        }



        recordData = {


          title:
            "Smart Corpus Management Report",



          description:
            "This document contains information about smart corpus management, document upload and text analysis.",



          language:
            "English",



          release_rights:
            "creator",



          location: {

            latitude:
              17.385,

            longitude:
              78.4867,

          },



          media_type:
            "text",



          file_url:
            "https://example.com/document.txt",



          file_name:
            file.name,



          file_size:
            Math.max(file.size, 1024),



          status:
            "pending",



          reviewed:
            false,



          source_label:
            "Frontend Upload",



          source_url:
            "https://example.com",



          user_id:
            userId,



          category_ids: [],


          tagged_usernames: [],


          hashtags: [],


          record_tags: [],



          device_id:
            deviceId,

        };



      } else {



        if (!title || !content) {

          setMessage(
            "Please enter title and content."
          );

          return;

        }



        recordData = {



          title:
            title,



          description:
            content,



          language:
            "English",



          release_rights:
            "creator",



          location: {

            latitude:
              17.385,

            longitude:
              78.4867,

          },



          media_type:
            "text",



          file_url:
            "https://example.com/text-document.txt",



          file_name:
            `${title}.txt`,



          file_size:
            Math.max(content.length, 1024),



          status:
            "pending",



          reviewed:
            false,



          source_label:
            "Text Upload",



          source_url:
            "https://example.com",



          user_id:
            userId,



          category_ids: [],


          tagged_usernames: [],


          hashtags: [],


          record_tags: [],



          device_id:
            deviceId,

        };


      }




      console.log(
        "Sending Data:",
        recordData
      );



      const response = await api.post(
        "/api/v1/records",
        recordData
      );



      console.log(
        "Upload Success:",
        response.data
      );



      setMessage(
        "Document created successfully."
      );



      setFile(null);

      setTitle("");

      setContent("");



    } catch (error: any) {



      console.log(
        "Full Backend Error:",
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );



      setMessage(

        error.response?.data?.message ||

        error.response?.data?.detail ||

        "Failed to create document."

      );



    } finally {


      setLoading(false);


    }

  };





  return (

    <div className="p-5">


      <div className="max-w-xl bg-white rounded-lg shadow-md p-4">


        <h1 className="text-xl font-bold mb-3">
          Upload Documents
        </h1>




        <div className="flex gap-3 mb-4">


          <button

            onClick={() => setMode("file")}

            className={`px-4 py-2 rounded-lg ${
              mode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}

          >

            Upload File

          </button>




          <button

            onClick={() => setMode("text")}

            className={`px-4 py-2 rounded-lg ${
              mode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}

          >

            Create Text

          </button>


        </div>





        {mode === "file" && (

          <>

            <input

              type="file"

              onChange={(e)=>{

                if(e.target.files?.length){

                  setFile(
                    e.target.files[0]
                  );

                }

              }}

              className="w-full border p-2 rounded-lg"

            />



            {file && (

              <p className="mt-2 text-sm">

                Selected:
                <b> {file.name}</b>

              </p>

            )}


          </>

        )}






        {mode === "text" && (

          <div className="space-y-3">


            <input

              type="text"

              placeholder="Document title"

              value={title}

              onChange={(e)=>
                setTitle(e.target.value)
              }

              className="w-full border p-2 rounded-lg"

            />



            <textarea

              placeholder="Enter document content"

              value={content}

              onChange={(e)=>
                setContent(e.target.value)
              }

              rows={5}

              className="w-full border p-2 rounded-lg"

            />


          </div>

        )}






        <button

          onClick={handleCreateRecord}

          disabled={loading}

          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"

        >

          {
            loading
            ?
            "Creating..."
            :
            "Create Document"
          }

        </button>





        {message && (

          <div className="mt-3 bg-gray-100 p-2 rounded-lg">

            {message}

          </div>

        )}


      </div>


    </div>

  );

}