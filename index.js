// marked.setOptions({
//      breaks: true
// })

// const renderer = new marked.Renderer(); 

// function App () {
//     const [text, setText] = React.useState("");
//     return (
//         <div className="text-center px-4">
//             <textarea 
//             name="text" 
//             id="text" 
//             rows="10"
//             value={text}
//             onChange={(e) => setText(e.target.value)} 
//             className="markdown-textarea"
//             ></textarea>
//             <h3 className="mt-3">Output</h3>
//             <Preview markdown={text} />
//         </div>
//     );
// } 

// function Preview ({ markdown }) {
//     return (<div
//         dangerouslySetInnerHTML={{ __html: marked(markdown, { renderer: renderer }),
//          }}
//         id="preview"
//     ></div>
//     )
// }

// ReactDOM.render(<App />, document.getElementById('root'))