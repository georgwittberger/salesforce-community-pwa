public with sharing class scpwa_CommunityPwaLoaderCtrl {
  public String getContent() {
    StaticResource loader = [
      SELECT Body FROM StaticResource WHERE Name = 'scpwa_CommunityPwaLoader' LIMIT 1
    ];
    return loader.Body.toString();
  }
}
