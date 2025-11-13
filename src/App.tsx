{/* Public */}
<Route path="/" element={<Index />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/update-password" element={<UpdatePassword />} />

{/* Authenticated Routes */}
<Route
  path="/prompts"
  element={
    <ProtectedRoute>
      <Prompts />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/billing"
  element={
    <ProtectedRoute>
      <Billing />
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>
<Route
  path="/app/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
<Route
  path="/app/my-prompts"
  element={
    <ProtectedRoute>
      <MyPrompts />
    </ProtectedRoute>
  }
/>
<Route
  path="/favorites"
  element={
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  }
/>

{/* Free Prompt Pack Page */}
<Route
  path="/free-prompt-pack"
  element={
    <ProtectedRoute>
      <FreePromptPackPage />
    </ProtectedRoute>
  }
/>

{/* ✅ YOUR NEW PUBLIC PAGE */}
<Route path="/ai-prompts" element={<AiPromptsPage />} />

{/* Catch all */}
<Route path="*" element={<NotFound />} />
