public with sharing class scpwa_CommunityManifestCtrl {
  public String getContent() {
    StaticResource manifest = [
      SELECT Body FROM StaticResource WHERE Name = 'scpwa_CommunityManifest' LIMIT 1
    ];
    return replaceResourcesLastModified(replaceUrlPrefix(manifest.Body.toString()));
  }

  private static String replaceUrlPrefix(String content) {
    PageReference currentPage = ApexPages.currentPage();
    if (currentPage == null || currentPage.getParameters() == null || String.isBlank(currentPage.getParameters().get('urlPrefix'))) {
      return content.replace('{urlPrefix}', '');
    }
    return content.replace('{urlPrefix}', currentPage.getParameters().get('urlPrefix').replace('"', '\\"'));
  }

  private static String replaceResourcesLastModified(String content) {
    StaticResource resources = [
      SELECT LastModifiedDate FROM StaticResource WHERE Name = 'scpwa_CommunityResources' LIMIT 1
    ];
    return content.replace('{resourcesLastModified}', String.valueOf(resources.LastModifiedDate.getTime()));
  }
}
