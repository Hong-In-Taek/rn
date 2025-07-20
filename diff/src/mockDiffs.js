export const diffs = [
  {
    old_path: "src/components/Button.js",
    new_path: "src/components/Button.js",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/src/components/Button.js b/src/components/Button.js
index 1234567..89abcde 100644
--- a/src/components/Button.js
+++ b/src/components/Button.js
@@ -5,7 +5,8 @@ export const Button = () => {
   return (
-    <button>Click me</button>
+    <button className="btn-primary">Click me</button>
+    // 버튼에 기본 클래스 추가
   );
 };
`,
  },
  {
    old_path: "src/hooks/useAuth.js",
    new_path: "src/hooks/useAuth.js",
    new_file: true,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/src/hooks/useAuth.js b/src/hooks/useAuth.js
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/src/hooks/useAuth.js
@@ -0,0 +1,5 @@
+import { useState } from 'react';
+
+export function useAuth() {
+  const [user, setUser] = useState(null);
+  return { user, login: setUser };
+}
`,
  },
  {
    old_path: "src/pages/OldHome.js",
    new_path: "src/pages/Home.js",
    new_file: false,
    renamed_file: true,
    deleted_file: false,
    diff: `diff --git a/src/pages/OldHome.js b/src/pages/Home.js
similarity index 100%
rename from src/pages/OldHome.js
rename to src/pages/Home.js
`,
  },
  {
    old_path: "src/styles/unused.css",
    new_path: "src/styles/unused.css",
    new_file: false,
    renamed_file: false,
    deleted_file: true,
    diff: `diff --git a/src/styles/unused.css b/src/styles/unused.css
deleted file mode 100644
index abcd123..0000000
--- a/src/styles/unused.css
+++ /dev/null
@@ -1,4 +0,0 @@
-.old-style {
-  color: red;
-  background: yellow;
-}
`,
  },
  {
    old_path: "src/components/Tree.js",
    new_path: "src/components/Tree.js",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/src/components/Tree.js b/src/components/Tree.js\nindex 123..456 100644\n--- a/src/components/Tree.js\n+++ b/src/components/Tree.js\n@@ -1,3 +1,4 @@\n+추가된 줄\n 기존1\n 기존2\n-삭제된 줄\n`,
  },
  {
    old_path: "src/utils/parse.js",
    new_path: "src/utils/parse.js",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/src/utils/parse.js b/src/utils/parse.js\nindex 789..abc 100644\n--- a/src/utils/parse.js\n+++ b/src/utils/parse.js\n@@ -1,2 +1,2 @@\n-옛날줄\n+새로운줄\n`,
  },
  {
    old_path: "README.md",
    new_path: "README.md",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/README.md b/README.md\nindex 111..222 100644\n--- a/README.md\n+++ b/README.md\n@@ -1 +1,2 @@\n+추가된 README\n 기존 README\n`,
  },
  
  {
    old_path: "src/components/LargeComponent.js",
    new_path: "src/components/LargeComponent.js",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    diff: `diff --git a/src/components/LargeComponent.js b/src/components/LargeComponent.js
index a1b2c3d..e4f5g6h 100644
--- a/src/components/LargeComponent.js
+++ b/src/components/LargeComponent.js
@@ -1,10 +1,11 @@
-import React from 'react';
+import React, { useEffect, useState } from 'react';

-const LargeComponent = () => {
+const LargeComponent = ({ title }) => {
+  const [count, setCount] = useState(0);

   return (
     <div className="container">
-      <h1>Hello World</h1>
-      <p>This is a large component</p>
+      <h1>{title}</h1>
+      <p>This is an updated large component</p>
+      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
     </div>
   );
 };

@@ -12,7 +13,30 @@
-export default LargeComponent;
+export default LargeComponent;

+// 추가된 함수들
+function helperA() {
+  return 'A';
+}

+function helperB() {
+  return 'B';
+}

+function helperC() {
+  return 'C';
+}

+function helperD() {
+  return 'D';
+}

+function helperE() {
+  return 'E';
+}

+// 불필요해진 함수 제거
-function oldFunction() {
-  console.log("This was removed");
-}
+// 주석 처리됨
+// function unused() {
+//   return 'no longer needed';
+// }

+// 예제 useEffect 추가
+useEffect(() => {
+  console.log('Component Mounted');
+}, []);
`,
  },
];
