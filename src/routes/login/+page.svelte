<script>
  let { data, form } = $props();
</script>

<div>
  <h2>Please Enter your credentials</h2>

  {#if form}
    <p>{form.message}</p>
  {/if}

  <form method="POST">
    <!-- Dropdown list -->
    <label>
      User Role
      <select name="user_role" required>
        <!-- <option value="" disabled selected>Role</option> -->
        <option value="student" selected>Student</option>
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
      </select>
    </label>

    <label>
      Email
      <input
        name="user_email"
        type="email"
        required
      >
    </label>

    <label>
      Password
      <input
        name="user_password"
        type="password"
        required
      >
    </label>

    <button>Login</button>
  </form>
</div>
