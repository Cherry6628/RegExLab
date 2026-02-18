import Header from "../../component/Header/Header";
export default function AllLabs() {
  console.log(location.hash);
  document.getElementById(location.hash)?.scrollTo();
  return (
    <>
      <div style={{ height: "100px" }}>
        <Header />
      </div>
      <div>All Labs</div>
    </>
  );
}
