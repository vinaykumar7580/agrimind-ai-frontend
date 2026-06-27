"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Leaf, Sparkles, User } from "lucide-react";


const suggestions = [
  "What disease is affecting my crop?",
  "How to increase wheat yield?",
  "Best fertilizer schedule for kharif",
  "When should I harvest my soybeans?",
];


const aiResponses = {
  default:
    "Based on your crop image analysis, I can see signs of early-stage nutrient deficiency — likely nitrogen. I recommend applying urea at 20 kg/acre within the next 5–7 days. The yellowing pattern starting from older leaves is a classic N-deficiency marker.",

  disease:
    "The image shows symptoms consistent with Early Blight (Alternaria solani). Apply copper-based fungicide or Mancozeb 75 WP at 2g/litre every 7–10 days. Remove and destroy infected leaves. Ensure proper field drainage to prevent recurrence.",

  yield:
    "To boost wheat yield: (1) Timely sowing between Oct 25–Nov 10 in your region, (2) Seed treatment with Vitavax Power @ 2.5g/kg, (3) Split nitrogen — 50% basal, 25% at CRI stage, 25% at tillering.",

  fertilizer:
    "For Kharif crops in alluvial soil (pH 6.8): Base dose — DAP 100 kg/ha + MOP 50 kg/ha at sowing. Top dressing — Urea 50 kg/ha at 30 DAS and again at 60 DAS.",

  harvest:
    "Your soybeans should be ready in ~18 days. Look for: 95% pod browning, seed moisture below 14%, leaves fully yellowed and dropped. Best harvest window: early morning to reduce shattering loss.",
};


function getResponse(text) {
  const lower = text.toLowerCase();

  if (lower.includes("disease") || lower.includes("blight"))
    return aiResponses.disease;

  if (lower.includes("yield") || lower.includes("increase"))
    return aiResponses.yield;

  if (lower.includes("fertilizer") || lower.includes("kharif"))
    return aiResponses.fertilizer;

  if (lower.includes("harvest") || lower.includes("soybean"))
    return aiResponses.harvest;

  return aiResponses.default;
}


export default function ChatPanel() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hello! I'm AgriMind AI. Upload a crop or soil image to get personalized analysis, or ask me anything about your farm.",
      time: "Now",
    },
  ]);


  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);


  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, isTyping]);



  const sendMessage = async (text) => {

    const msg = text || input.trim();

    if (!msg) return;


    setInput("");


    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });


    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: msg,
        time: now,
      },
    ]);


    setIsTyping(true);


    await new Promise(resolve =>
      setTimeout(resolve, 1200 + Math.random() * 800)
    );


    setIsTyping(false);


    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: getResponse(msg),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };



  return (
    <div className="flex flex-col" style={{ minHeight:"500px" }}>


      {/* Header */}

      <div
        className="flex items-center gap-3 pb-4 mb-4"
        style={{
          borderBottom:"1px solid rgba(61,154,64,0.15)"
        }}
      >

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(61,154,64,0.3), rgba(82,196,85,0.2))",
            border:
              "1px solid rgba(61,154,64,0.3)",
          }}
        >
          <Sparkles size={16} style={{color:"#52C455"}}/>
        </div>


        <div>

          <p
            className="text-sm font-semibold"
            style={{color:"#F0EBE0"}}
          >
            AgriMind Chat
          </p>


          <div className="flex items-center gap-1.5">

            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{background:"#52C455"}}
            />

            <p
              className="text-xs"
              style={{color:"#6B8F6B"}}
            >
              Online · Powered by AI
            </p>

          </div>

        </div>

      </div>





      {/* Messages */}

      <div
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
        style={{maxHeight:"380px"}}
      >

        {messages.map((msg,i)=>(

          <div
            key={i}
            className={`flex items-start gap-2.5 ${
              msg.role==="user"
              ? "flex-row-reverse"
              : ""
            }`}
          >


            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background:"rgba(61,154,64,0.2)",
                border:"1px solid rgba(61,154,64,0.3)"
              }}
            >

              {
              msg.role==="ai"
              ?
              <Leaf size={13} style={{color:"#52C455"}}/>
              :
              <User size={13} style={{color:"#52C455"}}/>
              }

            </div>



            <div
              className={`max-w-xs ${
                msg.role==="ai"
                ? "chat-ai"
                : "chat-user"
              } px-4 py-3`}
            >

              <p
                className="text-sm"
                style={{
                  color:"#F0EBE0",
                  lineHeight:"1.6"
                }}
              >
                {msg.text}
              </p>


              <p
                className="text-xs mt-1.5"
                style={{color:"#6B8F6B"}}
              >
                {msg.time}
              </p>


            </div>


          </div>

        ))}



        {isTyping && (

          <div className="flex items-start gap-2.5">

            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background:"rgba(61,154,64,0.2)",
                border:"1px solid rgba(61,154,64,0.3)"
              }}
            >
              <Leaf size={13} style={{color:"#52C455"}}/>
            </div>


            <div className="chat-ai px-4 py-3">

              <div className="flex gap-1">

                {[1,2,3].map(n=>(

                  <div
                    key={n}
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{background:"#52C455"}}
                  />

                ))}

              </div>

            </div>

          </div>

        )}


        <div ref={bottomRef}/>

      </div>



      {messages.length <= 2 && (

        <div className="flex flex-wrap gap-2 mb-3">

          {suggestions.map(s=>(

            <button
              key={s}
              onClick={()=>sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background:"rgba(61,154,64,0.1)",
                border:"1px solid rgba(61,154,64,0.2)",
                color:"#8FAF8F"
              }}
            >
              {s}
            </button>

          ))}

        </div>

      )}



      <div className="flex gap-2">


        <input

          value={input}

          onChange={(e)=>setInput(e.target.value)}

          onKeyDown={(e)=>{
            if(e.key==="Enter") sendMessage();
          }}

          placeholder="Ask about crops, soil, weather, or market..."

          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"

          style={{
            background:"rgba(0,0,0,0.3)",
            border:"1px solid rgba(61,154,64,0.2)",
            color:"#F0EBE0",
            fontFamily:"Inter, sans-serif"
          }}

        />


        <button

          onClick={()=>sendMessage()}

          disabled={!input.trim()}

          className="w-11 h-11 rounded-xl flex items-center justify-center"

          style={{
            background:
              input.trim()
              ? "rgba(61,154,64,0.25)"
              : "rgba(61,154,64,0.08)",

            border:
              `1px solid ${
                input.trim()
                ? "rgba(61,154,64,0.5)"
                : "rgba(61,154,64,0.15)"
              }`
          }}

        >

          <Send
            size={16}
            style={{
              color:
              input.trim()
              ? "#52C455"
              : "#3D5A3E"
            }}
          />

        </button>


      </div>


    </div>
  );
}