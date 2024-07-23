
[comment]: # (© Copyright IBM Corporation 2022. All Rights Reserved.)
[comment]: # (SPDX-License-Identifier: EPL-2.0)

# GUIDELINES

## Contributing In General

Our project welcomes external contributions. If you have an itch, please feel free to scratch it.

To contribute code please submit [pull request](https://github.ibm.com/AIAP/ai-assistance-platform/pulls).

To contribute documentation please submit [pull request](https://github.ibm.com/AIAP/docs-book/pulls).

Branch & Pull request names should be as self explainable as possible and follow one of these patterns: 
- **aiap-feat/{name_of_feature}**
- **aiap-fix/{name_of_fix}**

A good way to familiarize yourself with the codebase and contribution process is
to look for and tackle low-hanging fruit in the [issue tracker](https://github.ibm.com/AIAP/ai-assistance-platform/issuåes).

Before embarking on a more ambitious contribution, please quickly [get in touch](#communication) with us.

**Note: We appreciate your effort, and want to avoid a situation where a contribution
requires extensive rework (by you or by us), sits in backlog for a long time, or
cannot be accepted at all!**

### Proposing new features

If you would like to implement a new feature, please [raise an issue](https://github.ibm.com/AIAP/ai-assistance-platform/issues)
before sending a pull request so the feature can be discussed. This is to avoid
you wasting your valuable time working on a feature that the project developers
are not interested in accepting into the code base.

### Fixing bugs

If you would like to fix a bug, please [raise an issue](https://github.ibm.com/aca/opensource-repo-template/issues) before sending a
pull request so it can be tracked.

Issue, Branch & Pull request names should be as self explainable as possible and follow one of these patterns: 
- **aiap-feat/{name_of_feature}**
- **aiap-fix/{name_of_fix}**

### Merge approval

The project maintainers use LGTM (Looks Good To Me) in comments on the code
review to indicate acceptance. A change requires LGTM from **two** maintainers.

For a list of the maintainers, see the [MAINTAINERS.md](MAINTAINERS.md) page.

## Legal

### License and Copyright statement

Each source file must include a license header for [Eclipse Public License 2.0](https://opensource.org/licenses/EPL-2.0) Using the SPDX format is the simplest approach.
e.g.

```md
/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
```

### Managing commit signature verification

We have tried to make it as easy as possible to make contributions. This
applies to how we handle the legal aspects of contribution. We use the
same approach - the [Developer's Certificate of Origin 1.1 (DCO)](https://github.com/hyperledger/fabric/blob/master/docs/source/DCO1.1.txt) - that the Linux® Kernel [community](https://elinux.org/Developer_Certificate_Of_Origin)
uses to manage code contributions.

We simply ask that when submitting a patch for review, the developer
must include a sign-off statement in the commit message.

Here is an example Signed-off-by line, which indicates that the
submitter accepts the DCO:

```txt
DCO 1.1 Signed-off-by: Random J Developer <random@developer.org>
```

You can include this automatically when you commit a change to your
local git repository using the following command:

```bash
git commit -s
```

Other tips:

- [How to create signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- To configure your Git client to sign commits by default for a local repository, in Git versions 2.0.0 and above, run:  
  `git config commit.gpgsign true`.
- To sign all commits by default in any local repository on your computer, run:  
  `git config --global commit.gpgsign true`.

## Communication

Please feel free to connect with us on our [Slack channel](https://ibm-aca.slack.com/archives/C03UKRP7L91).

## Setup

**FIXME** Please add any special setup instructions for your project to help the developer
become productive quickly.


## LICENSE

© Copyright IBM Corporation 2022. All Rights Reserved.
