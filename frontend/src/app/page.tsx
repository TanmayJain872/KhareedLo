export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-8xl">Hi there,</h1>
      <p>
        This is a basic web application which allows its user to add, update, view and delete products. It has been implemented primarily using Next.js, Express.js and MongoDB (Mongoose). Auth Guard, User Authentication using JWT tokens, rate-limiting, clustering, all the required functionalities have been implemented.

        Only authenticated users can add, edit and remove products. Rest can view the products list and can register on the system to gain the same privileges. 
      </p>
    </div>
  );
}
