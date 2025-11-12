{user ? (
  <>
    <Link to="/prompts">
      <Button variant="ghost">Browse Prompts</Button>
    </Link>

    {/* Auth-only */}
    <Link to="/free-prompt-pack">
      <Button variant="ghost">Free Prompt Pack</Button>
    </Link>
    ...
  </>
) : (
  <>
    <Link to="/login"><Button variant="ghost">Log In</Button></Link>
    <Link to="/signup"><Button>Sign Up</Button></Link>
  </>
)}
